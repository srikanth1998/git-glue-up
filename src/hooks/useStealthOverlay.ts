
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OverlayPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OverlayState {
  isVisible: boolean;
  isAvailable: boolean;
  position: OverlayPosition | null;
}

export const useStealthOverlay = (sessionId: string) => {
  const [state, setState] = useState<OverlayState>({
    isVisible: false,
    isAvailable: false,
    position: null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

<<<<<<< HEAD
  // Check if native helper is available
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const response = await fetch('http://localhost:8765', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setState(prev => ({ ...prev, isAvailable: true }));
      } catch (error) {
        setState(prev => ({ ...prev, isAvailable: false }));
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 5000);
    return () => clearInterval(interval);
  }, []);
=======
  // Check if native helper is available by using the native audio hook
  const { capabilities, isConnected, showOverlay, hideOverlay, updateOverlay } = require('@/hooks/useNativeAudio')(sessionId);

  useEffect(() => {
    setState(prev => ({ ...prev, isAvailable: capabilities.available && isConnected }));
  }, [capabilities.available, isConnected]);
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03

  const createOverlay = useCallback(async (position?: OverlayPosition) => {
    if (!state.isAvailable || !sessionId) return;

    setLoading(true);
    try {
<<<<<<< HEAD
      const ws = new WebSocket('ws://localhost:8765');
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          action: 'createOverlay',
          sessionId,
          position
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'overlayCreated') {
          setState(prev => ({ 
            ...prev, 
            isVisible: true,
            position: message.position 
          }));
          
          toast({
            title: "Stealth Overlay Active",
            description: "Discrete overlay window is now ready for cross-device viewing.",
          });
        }
      };

      ws.onerror = () => {
        throw new Error('Failed to communicate with native helper');
      };
=======
      await showOverlay();
      
      setState(prev => ({ 
        ...prev, 
        isVisible: true,
        position: position || {
          x: window.screen.width - 350,
          y: 20,
          width: 320,
          height: 450
        }
      }));
      
      toast({
        title: "Stealth Overlay Active",
        description: "Discrete overlay window is now ready for cross-device viewing.",
      });
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03

    } catch (error: any) {
      console.error('Failed to create stealth overlay:', error);
      toast({
        title: "Overlay Error",
        description: error.message || "Failed to create stealth overlay",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [state.isAvailable, sessionId, toast]);

  const showOverlay = useCallback(async () => {
    if (!state.isAvailable) return;

    try {
      const ws = new WebSocket('ws://localhost:8765');
      ws.onopen = () => {
        ws.send(JSON.stringify({ action: 'showOverlay' }));
      };
      
=======
  }, [state.isAvailable, sessionId, toast, showOverlay]);

  const show = useCallback(async () => {
    if (!state.isAvailable) return;

    try {
      await showOverlay();
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
      setState(prev => ({ ...prev, isVisible: true }));
    } catch (error) {
      console.error('Failed to show overlay:', error);
    }
<<<<<<< HEAD
  }, [state.isAvailable]);

  const hideOverlay = useCallback(async () => {
    if (!state.isAvailable) return;

    try {
      const ws = new WebSocket('ws://localhost:8765');
      ws.onopen = () => {
        ws.send(JSON.stringify({ action: 'hideOverlay' }));
      };
      
=======
  }, [state.isAvailable, showOverlay]);

  const hide = useCallback(async () => {
    if (!state.isAvailable) return;

    try {
      await hideOverlay();
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
      setState(prev => ({ ...prev, isVisible: false }));
    } catch (error) {
      console.error('Failed to hide overlay:', error);
    }
<<<<<<< HEAD
  }, [state.isAvailable]);
=======
  }, [state.isAvailable, hideOverlay]);
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03

  const updateOverlayContent = useCallback(async (question: string, answer: string) => {
    if (!state.isAvailable || !state.isVisible) return;

    try {
<<<<<<< HEAD
      const ws = new WebSocket('ws://localhost:8765');
      ws.onopen = () => {
        ws.send(JSON.stringify({
          action: 'updateOverlay',
          question,
          answer
        }));
      };
    } catch (error) {
      console.error('Failed to update overlay content:', error);
    }
  }, [state.isAvailable, state.isVisible]);
=======
      await updateOverlay(question, answer);
    } catch (error) {
      console.error('Failed to update overlay content:', error);
    }
  }, [state.isAvailable, state.isVisible, updateOverlay]);
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03

  const setPosition = useCallback(async (position: OverlayPosition) => {
    if (!state.isAvailable) return;

    try {
<<<<<<< HEAD
      const ws = new WebSocket('ws://localhost:8765');
      ws.onopen = () => {
        ws.send(JSON.stringify({
          action: 'setOverlayPosition',
          position
        }));
      };
      
=======
      // Position setting would be handled by the native helper
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
      setState(prev => ({ ...prev, position }));
    } catch (error) {
      console.error('Failed to set overlay position:', error);
    }
  }, [state.isAvailable]);

  const toggleOverlay = useCallback(async () => {
    if (state.isVisible) {
<<<<<<< HEAD
      await hideOverlay();
    } else {
      await showOverlay();
    }
  }, [state.isVisible, showOverlay, hideOverlay]);
=======
      await hide();
    } else {
      if (!state.position) {
        await createOverlay();
      } else {
        await show();
      }
    }
  }, [state.isVisible, state.position, hide, show, createOverlay]);
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03

  return {
    ...state,
    loading,
    createOverlay,
<<<<<<< HEAD
    showOverlay,
    hideOverlay,
=======
    showOverlay: show,
    hideOverlay: hide,
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
    toggleOverlay,
    updateOverlayContent,
    setPosition
  };
};
