document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // 캔버스 초기화
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 텍스트 그리기
  const text = "따라쓸 글씨";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, 50);

  // 마우스 이벤트 처리
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseout", () => (isDrawing = false));

  // 연필 버튼 클릭 시
  document.getElementById("brush-btn").addEventListener("click", () => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    // 지우개 포인터 영역 제거
    canvas.style.cursor = "auto";
  });

  // 지우개 버튼 클릭 시 (작은 지우개)
  document.getElementById("eraser-btn-small").addEventListener("click", () => {
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
  });

  // 지우개 버튼 클릭 시 (중간 지우개)
  document.getElementById("eraser-btn-medium").addEventListener("click", () => {
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
  });

  // 지우개 버튼 클릭 시 (큰 지우개)
  document.getElementById("eraser-btn-large").addEventListener("click", () => {
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    // 지우개 포인터 영역 추가
    canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 16 16"><circle cx="8" cy="8" r="15" fill="white" stroke="black" stroke-width="2"/></svg>') 15 15, auto`;
  });

  // 완료 버튼 클릭 시
  document.getElementById("download-btn").addEventListener("click", () => {
    // 다운로드할 이미지를 생성하고 설정
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "canvas_image.png";
    link.click();
  });
});
