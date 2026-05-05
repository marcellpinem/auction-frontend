export const DURATION_PRESETS = [
  { label: "5 Menit", value: "5m" },
  { label: "1 Jam", value: "1h" },
  { label: "6 Jam", value: "6h" },
  { label: "12 Jam", value: "12h" },
  { label: "1 Hari", value: "1d" },
  { label: "3 Hari", value: "3d" },
  { label: "7 Hari", value: "7d" },
];

export const AUCTION_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  ENDED: "ended",
  CANCELLED: "cancelled",
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  CONFIRMED_BUYER: "confirmed_buyer",
  CONFIRMED_SELLER: "confirmed_seller",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const WALLET_TRANSACTION_TYPE = {
  TOPUP: "topup",
  WITHDRAW: "withdraw",
  HOLD: "hold",
  RELEASE: "release",
  FEE: "fee",
};

export const BID_STATUS = {
  WINNING: "winning",
  OUTBID: "outbid",
  WON: "won",
  LOST: "lost",
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_FILES: 5,
  ACCEPTED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

export const WALLET_CONFIG = {
  TOPUP_MIN: 10000,
  TOPUP_MAX: 10000000,
  WITHDRAW_MIN: 10000,
};

export const FEE_RATE = 0.03;
