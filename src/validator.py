import torch
import numpy as np
from Bio import motifs
from Bio.Seq import Seq
import urllib.request
import json

class SequenceValidator:
    def __init__(self, target_cell_types=['K562', 'HepG2', 'GM12878', 'hESCT0']):
        self.target_cell_types = target_cell_types
        # Expected approximate GC content for humans is ~41%, but can vary by regulatory element type.
        self.expected_gc = {
            'K562': 0.45,
            'HepG2': 0.46,
            'GM12878': 0.44,
            'hESCT0': 0.43
        }
        
        # Load Motif matrices from JASPAR API
        self.tf_motifs = self._load_jaspar_motifs()

    def _load_jaspar_motifs(self):
        # Use local fallback directly because JASPAR connection frequently times out
        counts = {
            'A': [ 10,  10,  10, 100,  10, 100,  50,  10 ],
            'C': [ 10,  10,  10,  10,  10,  10,  10,  10 ],
            'G': [ 10,  10, 100,  10,  10,  10,  10,  10 ],
            'T': [ 50, 100,  10,  10, 100,  10,  10,  50 ]
        }
        m = motifs.create(counts)
        return {'K562_<GATA1>': m}

    def decode_onehot(self, seq_tensor):
        # seq_tensor: (channels, seq_len) where channels=4 (A, C, G, T)
        chars = ['A', 'C', 'G', 'T']
        indices = torch.argmax(seq_tensor, dim=0).cpu().numpy()
        return "".join([chars[i] for i in indices])

    def check_gc_content(self, seq_str):
        if len(seq_str) == 0:
            return 0
        gc_count = seq_str.count('G') + seq_str.count('C')
        return gc_count / len(seq_str)

    def check_cpg_count(self, seq_str):
        return seq_str.count('CG')

    def scan_motifs(self, seq_str, motif_key):
        motif = self.tf_motifs.get(motif_key)
        if motif is None:
            return 0
        
        # Create PWM and PSSM
        pwm = motif.counts.normalize(pseudocounts=0.5)
        pssm = pwm.log_odds()
        
        hits = 0
        seq = Seq(seq_str)
        # Search for motif in sequence
        # We use a loose threshold for synthetic sequence evaluation
        threshold = pssm.mean() + pssm.std() 
        for position, score in pssm.search(seq, threshold=threshold):
            hits += 1
        return hits

    def validate_batch(self, generated_tensor, classes):
        # generated_tensor: [batch_size, 4, seq_len]
        # classes: [batch_size] containing indices 0, 1, 2, 3
        results = []
        for i in range(generated_tensor.shape[0]):
            seq_str = self.decode_onehot(generated_tensor[i])
            cell_type = self.target_cell_types[classes[i].item()]
            
            gc = self.check_gc_content(seq_str)
            target_gc = self.expected_gc.get(cell_type, 0.45)
            gc_diff = abs(gc - target_gc)
            
            cpg = self.check_cpg_count(seq_str)
            
            # For this example, only score GATA1 for K562.
            motif_score = 0
            if cell_type == 'K562':
                motif_score = self.scan_motifs(seq_str, 'K562_<GATA1>')
                
            results.append({
                'cell_type': cell_type,
                'gc_content': gc,
                'gc_diff': gc_diff,
                'cpg_count': cpg,
                'gata1_hits': motif_score if cell_type == 'K562' else None,
                'sequence_head': seq_str[:20] + "..."
            })
            
        return results

    def print_report(self, results):
        print("\n--- Validation Report ---")
        for i, res in enumerate(results[:5]): # Print first 5
            print(f"Seq {i+1} | {res['cell_type']} | GC: {res['gc_content']:.2f} (diff {res['gc_diff']:.2f}) | CpG: {res['cpg_count']} | GATA1: {res['gata1_hits']} | {res['sequence_head']}")
        if len(results) > 5:
            print(f"... and {len(results)-5} more.")
