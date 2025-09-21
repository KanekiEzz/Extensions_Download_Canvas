(function() {
  try {
    const canvases = findCanvases();

    if (canvases.length === 0) {
      showMessage("❌ No canvas found on this page!", "error");
      return;
    }

    const merged = mergeCanvases(canvases);
    const fileName = generateFileName(canvases.length);
    
    downloadImage(merged.toDataURL("image/png"), fileName);
    showMessage(`✅ Downloaded ${fileName} (${canvases.length} canvas${canvases.length > 1 ? 'es' : ''})`, "success");

  } catch (error) {
    console.error('Canvas download error:', error);
    
    if (error.name === 'SecurityError') {
      showMessage("🚫 Canvas blocked by CORS policy", "error");
    } else {
      showMessage("❌ Failed to download canvas", "error");
    }
  }

  function findCanvases() {
    const allCanvases = document.querySelectorAll("canvas");
    
    return Array.from(allCanvases).filter(canvas => {
      const rect = canvas.getBoundingClientRect();
      const style = window.getComputedStyle(canvas);
      
      return (
        canvas.width > 0 && 
        canvas.height > 0 &&
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    });
  }

  function mergeCanvases(canvases) {
    if (canvases.length === 1) {
      return canvases[0];
    }

    const maxWidth = Math.max(...canvases.map(c => c.width));
    const maxHeight = Math.max(...canvases.map(c => c.height));
    
    const merged = document.createElement("canvas");
    merged.width = maxWidth;
    merged.height = maxHeight;
    const ctx = merged.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    canvases.forEach((canvas, index) => {
      try {
        const x = (maxWidth - canvas.width) / 2;
        const y = (maxHeight - canvas.height) / 2;
        ctx.drawImage(canvas, x, y);
      } catch (err) {
        console.warn(`Failed to draw canvas ${index}:`, err);
      }
    });

    return merged;
  }

  function generateFileName(canvasCount) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const suffix = canvasCount > 1 ? `_merged_${canvasCount}` : '';
    return `canvas_${timestamp}${suffix}.png`;
  }

  function downloadImage(dataUrl, fileName) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showMessage(message, type = "info") {
    const existingMsg = document.querySelector('.canvas-download-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = 'canvas-download-message';
    messageEl.textContent = message;
    
    const styles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '300px',
      wordWrap: 'break-word'
    };

    if (type === 'success') {
      styles.background = '#d4edda';
      styles.color = '#155724';
      styles.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
      styles.background = '#f8d7da';
      styles.color = '#721c24';
      styles.border = '1px solid #f5c6cb';
    } else {
      styles.background = '#d1ecf1';
      styles.color = '#0c5460';
      styles.border = '1px solid #bee5eb';
    }

    Object.assign(messageEl.style, styles);
    
    document.body.appendChild(messageEl);

    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 3000);
  }
})();