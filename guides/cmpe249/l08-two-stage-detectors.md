## Lecture 8: Two-Stage Detectors & Foundations

### 1. The Classical Problem & R-CNN Pipeline
- **Sliding Window:** Intractable due to $O(W \cdot H \cdot S \cdot A \cdot C_{\text{CNN}})$ complexity.
- **Selective Search:** Merges Felzenszwalb superpixels via 4 metrics:
  1. *Color similarity* (histogram intersection)
  2. *Texture similarity* (gradient histograms)
  3. *Size similarity* (merges smaller regions early)
  4. *Shape compatibility/fill* (eliminates empty space)
- **R-CNN:** 4 decoupled steps (Selective Search $\to$ AlexNet feature extraction on $227\times 227$ crops $\to$ SVMs $\to$ Bounding box ridge regression). Cannot be trained end-to-end.

### 2. SPP-Net & Fast R-CNN
- **SPP-Net:** Runs CNN backbone once on full image. Pools arbitrary feature maps into fixed bins ($4\times 4, 2\times 2, 1\times 1 = 21$ bins $\implies 21 \cdot C$ features).
- **Fast R-CNN:** Introduces RoI Pooling ($7\times 7$) and sibling output heads.
- **Smooth $L_1$ Loss:** Constant gradient ($\pm 1$) for $|x| \ge 1$ protects against outlier explosion; quadratic near zero for steady convergence.

### 3. Faster R-CNN & The RPN
- **Region Proposal Network (RPN):** Fully convolutional head sliding $3\times 3$ conv followed by two $1\times 1$ convs:
  - Objectness: $2k$ outputs (foreground/background logits)
  - Box Regression: $4k$ coordinate offsets
- **Default Anchors:** $k=9$ ($3\text{ scales: } 128^2, 256^2, 512^2 \times 3\text{ aspect ratios: } 1:1, 1:2, 2:1$).
- **Mini-Batch:** 256 anchors sampled 1:1 (up to 128 positives padded with negatives) to prevent background dominance.
- **RoIPool vs. RoIAlign:**
  - *RoIPool:* Rounds RoI coordinates and bin boundaries ($\lfloor \cdot \rfloor$), introducing 16–32px spatial misalignment.
  - *RoIAlign:* Maintains continuous floats; samples 4 points per bin via bilinear interpolation.
