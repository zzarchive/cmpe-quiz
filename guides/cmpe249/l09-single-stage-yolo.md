## Lecture 9: Single-Stage Detectors & YOLO Evolution

### 1. YOLOv1 (Redmon et al., 2016)
- **Concept:** Object detection as a single regression problem.
- **Grid Assignment:** Ground-truth box assigned strictly to the single cell containing its center coordinates.
- **Tensor Shape:** $S \times S \times (B \cdot 5 + C) = 7 \times 7 \times (2\cdot 5 + 20) = 7 \times 7 \times 30$ ($1,470$ values).
- **Limitation:** At most one class per grid cell; misses grouped small objects (flock of birds).

### 2. YOLOv2 / YOLO9000
- **Anchor Clustering:** K-means with distance metric $d = 1 - \text{IoU}(\text{box}, \text{centroid})$. $k=5$ anchors optimal.
- **Direct Location Prediction:** Constrains center to cell: $b_x = \sigma(t_x) + c_x$, preventing unstable coordinate drift.
- **Passthrough Layer:** Reorganizes $26\times 26\times 512$ feature map into $13\times 13\times 2048$ to preserve high-resolution spatial details.

### 3. YOLOv3 (Redmon & Farhadi, 2018)
- **Backbone:** Darknet-53 (53 conv layers with ResNet skip connections).
- **Multi-Scale Detection:** 3 heads via FPN top-down fusion:
  - P3 (stride 8, e.g. $52\times 52$): Small objects
  - P4 (stride 16, e.g. $26\times 26$): Medium objects
  - P5 (stride 32, e.g. $13\times 13$): Large objects
- **Output Channels:** $3 \times (4 + 1 + 80) = 255$ channels per grid cell.
- **Total Boxes on 416x416:** $52^2\cdot 3 + 26^2\cdot 3 + 13^2\cdot 3 = 8,112 + 2,028 + 507 = 10,647$.
- **Classification:** Transition from Softmax to independent Binary Cross-Entropy (BCE) for multi-label support.

### 4. YOLOv4 (Bochkovskiy et al., 2020)
- **Anatomy:** Backbone (CSPDarknet53), Neck (SPP + PANet), Head (YOLOv3 dense head).
- **Bag of Freebies (BoF):** Training-only improvements (0 inference latency cost):
  - Mosaic (4-image blend), CutMix, CIoU Loss, Label Smoothing, DropBlock.
- **Bag of Specials (BoS):** Lightweight architectural additions:
  - Mish Activation: $x\tanh(\text{softplus}(x))$
  - SPP Block: Parallel max-pools ($5\times 5, 9\times 9, 13\times 13$) concatenated to $H\times W\times 4C$.
  - PANet: Bottom-up pathway propagating fine localization signals up to head.
  - DIoU-NMS: Center distance penalty prevents suppressing adjacent objects.
