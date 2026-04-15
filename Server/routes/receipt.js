const express = require("express");
const router = express.Router();
const { Receipt } = require("../models/receipt");

const generateReceiptNumber = () => {
  return "RCPT-" + Date.now();
};


router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      paymentId,
      items,
      billingDetails,
      paymentMethod,
      amountPaid
    } = req.body;

  const receipt = new Receipt({
  userId,
  orderId,
  paymentId: paymentId || null, // ✅ correct
  receiptNumber: generateReceiptNumber(),
  items,
  billingDetails,
  paymentMethod,
  amountPaid,
  paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid"
});

    const savedReceipt = await receipt.save();

    res.status(201).json({
      success: true,
      receipt: savedReceipt
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate("userId", "name email")
      .populate("orderId")
      .populate("paymentId")
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      count: receipts.length,
      receipts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("userId")
      .populate("orderId")
      .populate("paymentId");

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.json({
      success: true,
      receipt
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Receipt.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.json({
      success: true,
      message: "Receipt deleted"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;