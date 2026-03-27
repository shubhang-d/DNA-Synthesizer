import torch
import torch.nn as nn
from tqdm.auto import tqdm

def linear_beta_schedule(timesteps):
    scale = 1000 / timesteps
    beta_start = scale * 0.0001
    beta_end = scale * 0.02
    return torch.linspace(beta_start, beta_end, timesteps, dtype=torch.float64)

class GaussianDiffusion1D(nn.Module):
    def __init__(self, model, seq_len=200, channels=4, timesteps=50):
        super().__init__()
        self.model = model
        self.channels = channels
        self.seq_len = seq_len
        self.timesteps = timesteps

        betas = linear_beta_schedule(timesteps)
        alphas = 1. - betas
        alphas_cumprod = torch.cumprod(alphas, dim=0)
        alphas_cumprod_prev = torch.cat([torch.tensor([1.]), alphas_cumprod[:-1]])

        self.register_buffer('betas', betas.float())
        self.register_buffer('alphas_cumprod', alphas_cumprod.float())
        self.register_buffer('alphas_cumprod_prev', alphas_cumprod_prev.float())

        self.register_buffer('sqrt_alphas_cumprod', torch.sqrt(alphas_cumprod).float())
        self.register_buffer('sqrt_one_minus_alphas_cumprod', torch.sqrt(1. - alphas_cumprod).float())

        self.register_buffer('posterior_variance', (betas * (1. - alphas_cumprod_prev) / (1. - alphas_cumprod)).float())

    def q_sample(self, x_start, t, noise=None):
        device = x_start.device
        if noise is None:
            noise = torch.randn_like(x_start)
        t = t.to(device)
        sqrt_alphas_cumprod_t = self.sqrt_alphas_cumprod.to(device)[t].view(-1, 1, 1)
        sqrt_one_minus_alphas_cumprod_t = self.sqrt_one_minus_alphas_cumprod.to(device)[t].view(-1, 1, 1)
        return sqrt_alphas_cumprod_t * x_start + sqrt_one_minus_alphas_cumprod_t * noise

    def p_losses(self, x_start, t, classes, noise=None):
        device = x_start.device
        t = t.to(device)
        classes = classes.to(device)
        if noise is None:
            noise = torch.randn_like(x_start)
        x_noisy = self.q_sample(x_start=x_start, t=t, noise=noise)
        predicted_noise = self.model(x_noisy, t, classes=classes)
        loss = nn.functional.mse_loss(predicted_noise, noise)
        return loss

    @torch.no_grad()
    def p_sample(self, x, t, t_index, classes, cfg_scale=3.0):
        b = x.shape[0]
        # Classifier-Free Guidance (CFG)
        if cfg_scale > 1.0:
            # Predict with condition and without condition
            x_double = torch.cat([x, x], dim=0)
            t_double = torch.cat([t, t], dim=0)
            classes_double = torch.cat([classes, torch.full((b,), self.model.null_class_idx, device=x.device, dtype=torch.long)], dim=0)

            # Important: set p_uncond to 0.0 to prevent masking inside the model during generation
            pred_noise_double = self.model(x_double, t_double, classes=classes_double, p_uncond=0.0)
            cond_pred, uncond_pred = pred_noise_double.chunk(2, dim=0)
            predicted_noise = uncond_pred + cfg_scale * (cond_pred - uncond_pred)
        else:
            predicted_noise = self.model(x, t, classes=classes, p_uncond=0.0)

        beta_t = self.betas[t_index].view(-1, 1, 1)
        sqrt_one_minus_alphas_cumprod_t = self.sqrt_one_minus_alphas_cumprod[t_index].view(-1, 1, 1)
        model_mean = (x - beta_t * predicted_noise / sqrt_one_minus_alphas_cumprod_t) / torch.sqrt(1. - beta_t)

        if t_index == 0:
            return model_mean
        else:
            posterior_variance_t = self.posterior_variance[t_index].view(-1, 1, 1)
            noise = torch.randn_like(x)
            return model_mean + torch.sqrt(posterior_variance_t) * noise

    @torch.no_grad()
    def sample(self, classes, batch_size=16, cfg_scale=3.0):
        device = self.betas.device
        shape = (batch_size, self.channels, self.seq_len)
        x = torch.randn(shape, device=device)

        for i in tqdm(reversed(range(0, self.timesteps)), desc='Sampling', total=self.timesteps, leave=False):
            t = torch.tensor([i] * batch_size, device=device, dtype=torch.long)
            x = self.p_sample(x, t, i, classes=classes, cfg_scale=cfg_scale)

        return x
