// auction-frontend/src/hooks/useWallet.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import api from "@/lib/axios";

export const useWallet = () => {
  const { isAuthenticated } = useAuth();
  const { subscribe } = useWebSocket();

  const [availableBalance, setAvailableBalance] = useState(0);
  const [heldBalance, setHeldBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/wallet");
      setAvailableBalance(data.data.availableBalance);
      setHeldBalance(data.data.heldBalance);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch saldo saat pertama load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWallet();
  }, [fetchWallet]);

  // Subscribe wallet_updated dari WebSocket — update saldo realtime
  useEffect(() => {
    const unsubscribe = subscribe(
      "wallet_updated",
      ({ availableBalance, heldBalance }) => {
        setAvailableBalance(availableBalance);
        setHeldBalance(heldBalance);
      },
    );
    return unsubscribe;
  }, [subscribe]);

  return {
    availableBalance,
    heldBalance,
    loading,
    refetch: fetchWallet,
  };
};
