from Bio.Seq import Seq
from Bio import motifs
from Bio.SeqUtils import gc_fraction

motif = ["GGCGC", "GGCGA"]
instances =[]
for i in motif:
     instance= Seq(i)
     instances.append(instance)

test_motif=motifs.create(instances)
pwm = test_motif.counts.normalize(pseudocounts=0.5)

def analyze_dna(seq_list):
    all_results=[]
    for seq_string in seq_list:
        scores = [pwm.calculate(seq_upper) for seq_upper in seq_string]
        max_score = max(scores)
        position = scores.index(max_score)
        if len(seq_string) != 200:
            raise ValueError(f"Sequence length must be 200 base pairs. Got {len(seq_string)}")
        
        seq_upper = seq_string.upper()

        gc_decimal = gc_fraction(seq_upper)
        gc_percentage = round(gc_decimal * 100,2)

        cpg_count = seq_upper.count("CG")
        has_ctcf = "CCGCGAGG" in seq_upper

        all_results.append({
            "gc_content" : gc_percentage,
            'cpg_count' : cpg_count,
            'length' : len(seq_upper),
            'has_ctcf' : has_ctcf
            'motif_score' : max_score,
            'motif_position' : position,
        })
    return all_results




# A dummy sequence for testing (200 characters)
test_sequence = "A" * 100 + "G" * 50 + "C" * 50 

# Call your function and print the results
results = analyze_dna(test_sequence)
print(results)