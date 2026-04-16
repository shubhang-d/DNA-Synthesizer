"use client";

const orbitCards = [
  {
    title: "DNA Dataset Input",
    description: "Upload FASTA and GenBank datasets with quality validation.",
    color: "34, 211, 238",
  },
  {
    title: "Sequence Tokenization",
    description: "Preserve regulatory motifs with DNA-aware tokenization.",
    color: "45, 212, 191",
  },
  {
    title: "Diffusion Model Training",
    description: "Train DDPM models with advanced noise scheduling.",
    color: "52, 211, 153",
  },
  {
    title: "Regulatory Pattern Learning",
    description: "Discover binding motifs and expression signals.",
    color: "250, 204, 21",
  },
  {
    title: "Synthetic DNA Generation",
    description: "Generate regulatory DNA with controlled expression strength.",
    color: "168, 85, 247",
  },
];

export default function FeatureOrbit({ features }) {
  const cards = (features?.length ? features : orbitCards).map((card, index) => ({
    ...card,
    color: card.color || orbitCards[index % orbitCards.length].color,
  }));

  return (
    <div className="feature-orbit" aria-label="Animated DNA platform workflow">
      <div className="feature-orbit__title">
        <span>DNA Diffusion</span>
        <small>Feature Pipeline</small>
      </div>
      <div className="feature-orbit__halo" />
      <div className="feature-orbit__core" aria-hidden="true" />
      <div className="feature-orbit__inner" style={{ "--quantity": cards.length }}>
        {cards.map((card, index) => (
          <div
            className="feature-orbit__card"
            key={card.title}
            style={{
              "--index": index,
              "--color-card": card.color,
            }}
          >
            <div className="feature-orbit__cardFace">
              <span>{card.title}</span>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .feature-orbit {
          position: relative;
          width: min(100%, 620px);
          min-height: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 8px;
          background:
            radial-gradient(circle at center, rgba(45, 212, 191, 0.16), transparent 38%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.94));
          border: 1px solid rgba(148, 163, 184, 0.18);
          box-shadow: 0 24px 80px rgba(2, 6, 23, 0.42);
          perspective: 1000px;
        }

        .feature-orbit__title {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(2, 6, 23, 0.72);
          border: 1px solid rgba(45, 212, 191, 0.24);
          backdrop-filter: blur(10px);
        }

        .feature-orbit__title span {
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0;
        }

        .feature-orbit__title small {
          margin-top: 3px;
          color: #5eead4;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .feature-orbit__halo {
          position: absolute;
          width: 72%;
          aspect-ratio: 1;
          border: 1px solid rgba(45, 212, 191, 0.18);
          border-radius: 999px;
          box-shadow:
            inset 0 0 40px rgba(45, 212, 191, 0.08),
            0 0 80px rgba(59, 130, 246, 0.12);
        }

        .feature-orbit__core {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.08), transparent 68%);
          border: 1px solid rgba(45, 212, 191, 0.14);
          box-shadow: 0 0 44px rgba(45, 212, 191, 0.1);
          z-index: 1;
          pointer-events: none;
        }

        .feature-orbit__inner {
          --w: 170px;
          --h: 205px;
          --translateZ: 245px;
          --rotateX: -14deg;
          position: absolute;
          width: var(--w);
          height: var(--h);
          transform-style: preserve-3d;
          animation: feature-rotating 22s linear infinite;
          z-index: 3;
        }

        @keyframes feature-rotating {
          from {
            transform: rotateX(var(--rotateX)) rotateY(0);
          }
          to {
            transform: rotateX(var(--rotateX)) rotateY(1turn);
          }
        }

        .feature-orbit__card {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(var(--color-card), 0.78);
          border-radius: 8px;
          overflow: hidden;
          transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
            translateZ(var(--translateZ));
          background:
            radial-gradient(circle, rgba(var(--color-card), 0.2) 0%, rgba(var(--color-card), 0.52) 100%),
            rgba(15, 23, 42, 0.7);
          box-shadow: 0 18px 36px rgba(var(--color-card), 0.12);
          backdrop-filter: blur(10px);
        }

        .feature-orbit__cardFace {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 10px;
          padding: 18px;
          background:
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08), transparent 35%),
            radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.35) 72%);
        }

        .feature-orbit__cardFace span {
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.25;
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.7);
        }

        .feature-orbit__cardFace p {
          color: rgba(226, 232, 240, 0.82);
          font-size: 0.72rem;
          line-height: 1.45;
          text-align: left;
        }

        @media (max-width: 768px) {
          .feature-orbit {
            min-height: 340px;
          }

          .feature-orbit__inner {
            --w: 124px;
            --h: 158px;
            --translateZ: 162px;
          }

          .feature-orbit__core {
            width: 108px;
            height: 108px;
          }

          .feature-orbit__cardFace {
            padding: 12px;
          }

          .feature-orbit__cardFace span {
            font-size: 0.76rem;
          }

          .feature-orbit__cardFace p {
            font-size: 0.62rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .feature-orbit__inner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
