// Start list
let items = document.querySelectorAll(".slider .list .item");
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let thumbnails = document.querySelectorAll(".thumbnail .item");

// config param
let countItem = items.length;
let itemActive = 0;
// event next click
next.onclick = function () {
  itemActive = itemActive + 1;
  if (itemActive >= countItem) {
    itemActive = 0;
  }
  showSlider();
};
//event prev click
prev.onclick = function () {
  itemActive = itemActive - 1;
  if (itemActive < 0) {
    itemActive = countItem - 1;
  }
  showSlider();
};
// auto run slider
let refreshInterval = setInterval(() => {
  next.click();
}, 5000);
function showSlider() {
  // remove item active old
  let itemActiveOld = document.querySelector(".slider .list .item.active");
  let thumbnailActiveOld = document.querySelector(".thumbnail .item.active");
  itemActiveOld.classList.remove("active");
  thumbnailActiveOld.classList.remove("active");

  // active new item
  items[itemActive].classList.add("active");
  thumbnails[itemActive].classList.add("active");
  setPositionThumbnail();

  // clear auto time run slider
  clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    next.click();
  }, 5000);
}
function setPositionThumbnail() {
  let thumbnailActive = document.querySelector(".thumbnail .item.active");
  let rect = thumbnailActive.getBoundingClientRect();
  if (rect.left < 0 || rect.right > window.innerWidth) {
    thumbnailActive.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  }
}

// click thumbnail
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    itemActive = index;
    showSlider();
  });
});
// End list
(function () {
  const row = document.getElementById("row");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // كم يتحرك الزر كل مرة (80% من عرض الحاوية)
  const scrollByWidth = () => Math.round(row.clientWidth * 0.8);

  nextBtn.addEventListener("click", () =>
    row.scrollBy({ left: scrollByWidth(), behavior: "smooth" })
  );
  prevBtn.addEventListener("click", () =>
    row.scrollBy({ left: -scrollByWidth(), behavior: "smooth" })
  );

  // تفعيل/تعطيل الأزرار حسب الموضع
  function updateButtons() {
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    prevBtn.disabled = row.scrollLeft <= 5;
    nextBtn.disabled = row.scrollLeft >= maxScrollLeft - 5;
  }
  row.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();

  // سحب بالماوس / اللمس باستخدام Pointer Events
  let isDown = false,
    startX = 0,
    startScroll = 0;
  row.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = row.scrollLeft;
    row.classList.add("dragging");
    row.setPointerCapture && row.setPointerCapture(e.pointerId);
  });
  row.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    row.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    isDown = false;
    row.classList.remove("dragging");
    try {
      row.releasePointerCapture && row.releasePointerCapture(e.pointerId);
    } catch {}
  }
  row.addEventListener("pointerup", endDrag);
  row.addEventListener("pointercancel", endDrag);
  row.addEventListener("pointerleave", endDrag);

  // مفاتيح لو بتحب (يسار/يمين)
  row.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      row.scrollBy({ left: scrollByWidth(), behavior: "smooth" });
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      row.scrollBy({ left: -scrollByWidth(), behavior: "smooth" });
    }
  });
})();

// الازرار

document.addEventListener("DOMContentLoaded", () => {
  const perPage = 8; // عدد الصور في كل صفحة

  document.querySelectorAll(".tab-pane").forEach((tab) => {
    const movies = Array.from(tab.querySelectorAll(".movie-card"));
    const pagination = tab.querySelector(".pagination");
    if (!pagination) return;

    // نحسب عدد الصفحات بناءً على عدد الصور
    const totalPages = Math.ceil(movies.length / perPage);

    // توليد أزرار الصفحات
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.classList.add("page-btn");
      btn.textContent = i;
      btn.setAttribute("data-page", i);
      pagination.appendChild(btn);
    }

    // لو الصور ≤ 8 يظهر زر واحد فقط
    if (movies.length <= perPage) {
      pagination.innerHTML =
        '<button class="page-btn active" data-page="1">1</button>';
    }

    // إضافة حدث للزرار
    pagination.querySelectorAll(".page-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const page = parseInt(e.target.getAttribute("data-page"));
        const start = (page - 1) * perPage;
        const end = start + perPage;

        movies.forEach((movie, i) => {
          movie.parentElement.style.display =
            i >= start && i < end ? "" : "none";
        });

        // تحديث الزر النشط
        pagination
          .querySelectorAll(".page-btn")
          .forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    // تحميل الصفحة الأولى تلقائيًا
    const firstBtn = pagination.querySelector(".page-btn");
    if (firstBtn) firstBtn.click();
  });
});
