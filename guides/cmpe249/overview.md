## 📖 CMPE 249: Intelligent Autonomous Systems
### Basic 2D Object Detection Master Study Guide (Lectures 8, 9, 10)

This master guide covers the essential theory, tensor architectures, loss functions, and evaluation metrics for the Thursday Quiz.

---

### High-Yield Architecture Summary

| Model | Proposal Method | Shared Features? | Output Prediction | Key Innovation / Bottleneck |
| :--- | :--- | :---: | :--- | :--- |
| **R-CNN** | Selective Search (~2k) | ❌ No | 4,096-d feature $\to$ SVM + Ridge | ~47s/img; crops warped to $227\times 227$; decoupled training |
| **SPP-Net** | Selective Search | ✅ Yes | Spatial Pyramid Bins ($21 \cdot C$) | Conv ran once on full image; fixed-bin spatial pooling |
| **Fast R-CNN** | Selective Search | ✅ Yes | $7\times 7$ RoIPool $\to$ Sibling FC Heads | Multi-task loss (Log loss + Smooth $L_1$); end-to-end backprop |
| **Faster R-CNN** | RPN ($k=9$ anchors) | ✅ Yes | RoIPool/RoIAlign $\to$ FC Heads | RPN shares conv backbone; ~17.1k anchors $\to 300$ RoIs |
| **YOLOv1** | $S\times S$ dense grid | ✅ Yes | $7\times 7\times (2\cdot 5 + 20) = 30$ | Direct single-stage regression; struggles on grouped small objects |
| **YOLOv2** | Anchor priors (k-means) | ✅ Yes | $13\times 13\times (5\cdot (5+20))$ | $d = 1 - \text{IoU}$; direct location prediction; passthrough layer |
| **YOLOv3** | Darknet-53 + FPN Neck | ✅ Yes | 3 scales: P3/P4/P5 $\times 255$ | Multi-scale detection; independent BCE; 10,647 candidate boxes |
| **YOLOv4** | CSPDarknet53 + PANet | ✅ Yes | Dense multi-scale head | Bag of Freebies (Mosaic, CIoU) + Bag of Specials (Mish, SPP) |
| **YOLOv5** | CSP + AutoAnchor | ✅ Yes | Dense multi-scale head | Grid sensitivity fix $(-0.5, 1.5)$; bounded $(0, 4a)$ box scaling |

---

### Core Formula Quick Reference

1. **Fast R-CNN Multi-Task Loss:**
   $$L = L_{\text{cls}}(p, u) + \lambda [u \ge 1] \sum_{i \in \{x,y,w,h\}} \text{smooth}_{L_1}(t_i^u - v_i)$$

2. **Smooth $L_1$ Loss:**
   $$\text{smooth}_{L_1}(x) = \begin{cases} 0.5 x^2 & \text{if } |x| < 1 \\ |x| - 0.5 & \text{otherwise} \end{cases}$$

3. **YOLOv5 Box Decoding:**
   $$b_x = (2\sigma(t_x) - 0.5) + c_x, \quad b_w = p_w \cdot (2\sigma(t_w))^2$$

4. **Complete IoU (CIoU) Loss:**
   $$L_{\text{CIoU}} = 1 - \text{IoU} + \frac{\rho^2(b, b^{\text{gt}})}{c^2} + \alpha v$$

5. **COCO Primary Metric:**
   $$\text{mAP}_{50:95} = \frac{1}{10} \sum_{\tau=0.50}^{0.95} \text{mAP}_\tau$$
