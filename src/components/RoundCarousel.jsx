"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

const DEFAULT_IMAGES = [
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/e60dd7f7-a44f-40a7-df62-095b19cd8700/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/eec164e9-23f8-4f87-b48a-a208fa806100/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/859c75ea-953e-489e-be61-91a03a35d700/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/933a7615-f4b6-4eae-8ed1-705fa0e24400/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/7d4d2641-d6a8-4fef-e85c-b12ed100d500/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/ed7b1c40-3332-43d8-a9eb-4615ef341b00/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/31afae9c-5ba3-4ec3-2534-ed8198ed1100/w=800",
  },
  {
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/bd541261-75be-469c-7dc0-dae0ce81c400/w=800",
  },
];

const RoundCarousel = forwardRef(function RoundCarousel(
  {
    images = DEFAULT_IMAGES,
    imageWidth,
    imageHeight,
    spacing,
    speed = 3.5,
    direction = "right",
    drag = true,
    sensitivity = 5,
    tilt = -7,
    perspective = 2800,
    cornerRadius = 24,
    innerDim = 3.5,
    background = "transparent",
    pauseOnHover = true,
    style = {},
    onCardClick,
  },
  ref
) {
  const items = images && images.length > 0 ? images : DEFAULT_IMAGES;
  const count = items.length;

  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const targetRotRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    moved: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Responsive default sizes
  const [dimensions, setDimensions] = useState({
    w: imageWidth || 350,
    h: imageHeight || 450,
    s: spacing || 2.4,
  });

  useEffect(() => {
    const updateSize = () => {
      const containerWidth =
        containerRef.current?.offsetWidth ||
        (typeof window !== "undefined" ? window.innerWidth : 1200);

      const targetW = imageWidth || 350;
      const targetH = imageHeight || 450;
      const targetS = spacing || 2.4;

      if (containerWidth < 480) {
        setDimensions({
          w: Math.min(targetW, 200),
          h: Math.min(targetH, 265),
          s: Math.min(targetS, 1.5),
        });
      } else if (containerWidth < 768) {
        setDimensions({
          w: Math.min(targetW, 250),
          h: Math.min(targetH, 325),
          s: Math.min(targetS, 1.9),
        });
      } else if (containerWidth < 1024) {
        setDimensions({
          w: Math.min(targetW, 290),
          h: Math.min(targetH, 375),
          s: Math.min(targetS, 2.1),
        });
      } else if (containerWidth < 1280) {
        setDimensions({
          w: Math.min(targetW, 325),
          h: Math.min(targetH, 420),
          s: Math.min(targetS, 2.3),
        });
      } else {
        setDimensions({
          w: targetW,
          h: targetH,
          s: targetS,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [imageWidth, imageHeight, spacing]);

  const activeWidth = dimensions.w;
  const activeHeight = dimensions.h;
  const activeSpacing = dimensions.s;

  const angle = 360 / count;
  const factor = 1 + activeSpacing * 0.15;
  const radius = (activeWidth * factor) / (2 * Math.tan(Math.PI / count));
  const radiusPx = cornerRadius;
  const degPerSec = speed * 6 * (direction === "left" ? -1 : 1);

  // Expose controls for parent buttons (e.g. prev / next arrows)
  const stepRotate = useCallback(
    (stepDirection) => {
      const delta = stepDirection === "left" ? angle : -angle;
      const current =
        targetRotRef.current !== null ? targetRotRef.current : rotYRef.current;
      targetRotRef.current = Math.round((current + delta) / angle) * angle;
      velRef.current = 0;
    },
    [angle]
  );

  const rotateToIndex = useCallback(
    (index) => {
      const targetAngle = -index * angle;
      const current = rotYRef.current;
      const diff = ((targetAngle - current) % 360 + 540) % 360 - 180;
      targetRotRef.current = current + diff;
      velRef.current = 0;
    },
    [angle]
  );

  useImperativeHandle(
    ref,
    () => ({
      prev: () => stepRotate("left"),
      next: () => stepRotate("right"),
      rotateToIndex,
      getRotation: () => rotYRef.current,
    }),
    [stepRotate, rotateToIndex]
  );

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };
    apply();

    const draw = (now) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;

      if (!d.active) {
        if (targetRotRef.current !== null) {
          // Smooth spring interpolation towards target angle
          const diff = targetRotRef.current - rotYRef.current;
          if (Math.abs(diff) > 0.08) {
            rotYRef.current += diff * Math.min(f * 9, 0.25);
          } else {
            rotYRef.current = targetRotRef.current;
            targetRotRef.current = null;
          }
        } else if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94;
        } else {
          // Continuous auto-rotation while finger/mouse is not held down
          rotYRef.current += degPerSec * f;
        }
      }

      apply();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count]);

  // Global pointer release listener so releasing mouse/finger anywhere resumes rotation
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        setIsDragging(false);
      }
    };
    window.addEventListener("pointerup", handleGlobalRelease);
    window.addEventListener("pointercancel", handleGlobalRelease);
    window.addEventListener("blur", handleGlobalRelease);
    return () => {
      window.removeEventListener("pointerup", handleGlobalRelease);
      window.removeEventListener("pointercancel", handleGlobalRelease);
      window.removeEventListener("blur", handleGlobalRelease);
    };
  }, []);

  const onPointerDown = (e) => {
    if (!drag) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    dragRef.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
      startTime: Date.now(),
      moved: false,
    };
    velRef.current = 0;
    targetRotRef.current = null;
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    if (Math.abs(e.clientX - d.startX) > 4) {
      d.moved = true;
    }
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
  };

  const onPointerUp = (e) => {
    if (!drag) return;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const faceBase = {
    position: "absolute",
    inset: 0,
    borderRadius: radiusPx,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: activeHeight + 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background,
        perspective: `${perspective}px`,
        WebkitPerspective: `${perspective}px`,
        cursor: drag ? (isDragging ? "grabbing" : "grab") : "default",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: activeWidth,
            height: activeHeight,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const rawSrc = item?.src || item?.image;
            const src = rawSrc ? encodeURI(rawSrc) : "";

            return (
              <div
                key={item?.id || i}
                onClick={(e) => {
                  const duration =
                    Date.now() - (dragRef.current.startTime || 0);
                  // Only rotate to index on a quick tap (< 200ms); if held to pause, simply resume
                  if (!dragRef.current.moved && duration < 200) {
                    rotateToIndex(i);
                    onCardClick?.(item, i);
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  cursor: "pointer",
                }}
              >
                {/* Front Face (High fidelity, full lighting, title/subtitle) */}
                <div
                  style={{
                    ...faceBase,
                    backgroundColor: src ? "transparent" : "#121214",
                    backgroundImage: src ? `url("${src}")` : undefined,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow:
                      "0 28px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Subtle Vignette Overlay for Text Legibility */}
                  {(item?.title || item?.subtitle) && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.72) 68%, rgba(0,0,0,0.96) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Card Title & Subtitle */}
                  {item?.title && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: activeWidth >= 280 ? "26px 22px" : "18px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      <h3
                        style={{
                          fontSize:
                            activeWidth >= 280
                              ? "24px"
                              : activeWidth >= 230
                              ? "20px"
                              : "18px",
                          fontWeight: 600,
                          letterSpacing: "-0.025em",
                          color: "#ffffff",
                          margin: 0,
                          lineHeight: 1.15,
                          textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p
                          style={{
                            fontSize: activeWidth >= 280 ? "13.5px" : "12px",
                            fontWeight: 400,
                            color: "rgba(255, 255, 255, 0.65)",
                            margin: 0,
                            lineHeight: 1.3,
                            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                          }}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Back Face (Dimmed interior wall of the cylinder) */}
                <div
                  style={{
                    ...faceBase,
                    transform: "rotateY(180deg)",
                    backgroundColor: src ? "transparent" : "#151518",
                    backgroundImage: src ? `url("${src}")` : undefined,
                    filter: `brightness(${innerDim / 10})`,
                    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default RoundCarousel;
