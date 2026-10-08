## Lecture 10: Modern Anatomy, Losses & Evaluation Metrics

### 1. YOLOv5 Coordinate Decoding & Assignment
- **Grid Sensitivity Removal:**
  $$b_x = (2\sigma(t_x) - 0.5) + c_x, \quad b_y = (2\sigma(t_y) - 0.5) + c_y$$
  Expands range to $(-0.5, 1.5)$, eliminating boundary saturation.
- **Bounded Box Dimension Regression:**
  $$b_w = p_w \cdot (2\sigma(t_w))^2, \quad b_h = p_h \cdot (2\sigma(t_h))^2$$
  Bounds scaling strictly to $(0, 4a)$, completely eliminating exponential gradient explosions ($e^{t_w}$).
- **Anchor Matching Ratio Rule:** Positive match if $\max(w_{\text{gt}}/w_a, w_a/w_{\text{gt}}) < 4.0$.
- **Multi-Cell Positive Assignment:** Assigns primary cell plus up to 2 adjacent neighbor cells (up to 3 cells per object).

### 2. Geometric Bounding Box Losses
- **IoU Loss:** $1 - \text{IoU}$. Flaw: Zero gradient when boxes do not overlap.
- **Generalized IoU (GIoU):**
  $$L_{\text{GIoU}} = 1 - \text{IoU} + \frac{|C \setminus (A \cup B)|}{|C|}$$
  Penalizes enclosing box empty space; degrades to IoU when one box completely encloses the other.
- **Distance-IoU (DIoU):**
  $$L_{\text{DIoU}} = 1 - \text{IoU} + \frac{\rho^2(b, b^{\text{gt}})}{c^2}$$
  Directly minimizes normalized Euclidean distance between box centers.
- **Complete IoU (CIoU):**
  $$L_{\text{CIoU}} = 1 - \text{IoU} + \frac{\rho^2(b, b^{\text{gt}})}{c^2} + \alpha v$$
  Accounts for overlap area, center distance, and aspect ratio consistency $(\alpha v)$.

### 3. Non-Maximum Suppression (NMS)
- **Hard NMS:** Discards any candidate box with $\text{IoU} \ge \tau_{\text{NMS}}$. Erroneously deletes occluded true objects in dense crowds.
- **Soft-NMS:** Decays confidence exponentially using Gaussian penalty:
  $$s_i = s_i \exp\left( -\frac{\text{IoU}(M, b_i)^2}{\sigma} \right)$$
- **DIoU-NMS:** Subtracts distance metric $\rho^2/c^2$ from IoU, protecting adjacent objects with distinct centers.

### 4. COCO Evaluation Metrics
- **True Positive (TP):** Correct class, $\text{IoU} \ge \tau$, first match to GT box.
- **False Positive (FP):** Wrong class, $\text{IoU} < \tau$, or duplicate detection of already matched GT.
- **Precision & Recall:**
  $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}, \quad \text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$
- **Precision Interpolation:** $p_{\text{interp}}(r) = \max_{\tilde{r} \ge r} p(\tilde{r})$.
- **COCO Primary Metric:** $\text{mAP}_{50:95} = \frac{1}{10} \sum_{\tau=0.50}^{0.95} \text{mAP}_\tau$.
- **Scale Splits:** Small ($< 32^2$), Medium ($32^2 - 96^2$), Large ($> 96^2$).
- **Average Recall (AR):** $\text{AR} = 2 \int_{0.5}^{1.0} \text{recall}(o) do$. Emphasizes safety coverage.
