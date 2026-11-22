/* =====================================================
   THE EXCLUSIVES 017 - SHARED CODE (cart, search, menus)
   Used by both the Eats page (index.html) and the Bakery
   page (bakery.html). The cart is shared between them.
   ===================================================== */

const WHATSAPP = "27829764508";        // 082 976 4508 in international format (no +, no spaces)
const PHONE_SHOW = "082 976 4508";

const $ = (s) => document.querySelector(s);
const cents = (r) => Math.round(r * 100);
const money = (c) => "R" + (c % 100 === 0 ? (c / 100) + ".00" : (c / 100).toFixed(2));

/* ---- Cart (saved in the browser, shared by both pages) ---- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("ex017cart") || "[]"); } catch (e) { cart = []; }
const save = () => { try { localStorage.setItem("ex017cart", JSON.stringify(cart)); } catch (e) {} };

const waLink = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hi The Exclusives, I'd like to place an order.");
["heroWa", "contactWa", "waFloat", "footWa", "footWaIcon", "bucketWa"].forEach((id) => { const el = document.getElementById(id); if (el) el.href = waLink; });
const pl = $("#phoneLink"); if (pl) { pl.href = "tel:+" + WHATSAPP; pl.textContent = PHONE_SHOW; }
$("#yr").textContent = new Date().getFullYear();

let tt;
function toast(t) {
  const el = $("#toast"); el.textContent = t; el.classList.add("on");
  clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 1800);
}

function addToCart(name, price) {
  const f = cart.find((x) => x.n === name);
  if (f) f.q++; else cart.push({ n: name, c: cents(price), q: 1 });
  save(); renderCart(); toast("Added to your order");
  const b = $("#cartBtn"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
}

function renderCart() {
  const wrap = $("#cartItems");
  wrap.innerHTML = "";
  let total = 0, count = 0;
  cart.forEach((it, i) => {
    total += it.c * it.q; count += it.q;
    const r = document.createElement("div");
    r.className = "line";
    r.innerHTML = "<div class='nm'><span></span><small></small></div><div class='qty'><button>&minus;</button><span></span><button>+</button></div>";
    r.querySelector(".nm span").textContent = it.n;
    r.querySelector("small").textContent = money(it.c) + " each";
    r.querySelector(".qty span").textContent = it.q;
    const [minus, plus] = r.querySelectorAll("button");
    minus.onclick = () => { it.q--; if (it.q <= 0) cart.splice(i, 1); save(); renderCart(); };
    plus.onclick = () => { it.q++; save(); renderCart(); };
    wrap.appendChild(r);
  });
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartEmpty").hidden = cart.length > 0;
  $("#checkout").hidden = cart.length === 0;
}

const drawer = $("#drawer"), overlay = $("#overlay");
function openCart() { drawer.classList.add("on"); overlay.classList.add("on"); drawer.setAttribute("aria-hidden", "false"); }
function closeCart() { drawer.classList.remove("on"); overlay.classList.remove("on"); drawer.setAttribute("aria-hidden", "true"); }
$("#cartBtn").onclick = openCart;
$("#closeCart").onclick = closeCart;
overlay.onclick = closeCart;
$("#clearBtn").onclick = () => { cart = []; save(); renderCart(); };

document.querySelectorAll("input[name=mode]").forEach((r) => {
  r.onchange = () => { $("#addrField").hidden = document.querySelector("input[name=mode]:checked").value !== "Delivery"; };
});

$("#sendBtn").onclick = () => {
  if (!cart.length) return;
  const name = $("#cName").value.trim();
  const mode = document.querySelector("input[name=mode]:checked").value;
  const addr = $("#cAddr").value.trim();
  const note = $("#cNote").value.trim();
  if (!name) { toast("Please enter your name"); $("#cName").focus(); return; }
  if (mode === "Delivery" && !addr) { toast("Please enter your delivery address"); $("#cAddr").focus(); return; }
  let total = 0;
  let msg = "*NEW ORDER - The Exclusives 017*\n\n";
  cart.forEach((it) => { total += it.c * it.q; msg += it.q + " x " + it.n + " - " + money(it.c * it.q) + "\n"; });
  msg += "\n*Total: " + money(total) + "* (delivery fee not included)\n";
  msg += "Name: " + name + "\nType: " + mode + "\n";
  if (mode === "Delivery") msg += "Address: " + addr + "\n";
  if (note) msg += "Notes: " + note + "\n";
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank");
};

/* ---- Lightbox (tap a photo to enlarge) ---- */
const lb = $("#lightbox"), lbImg = $("#lbImg");
function zoom(src, alt) { lbImg.src = src; lbImg.alt = alt || ""; lb.classList.add("on"); }
document.querySelectorAll(".gallery img, .board img, .zoomable").forEach((im) => im.onclick = () => zoom(im.currentSrc || im.src, im.alt));
lb.onclick = () => lb.classList.remove("on");
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { lb.classList.remove("on"); closeCart(); } });

/* ---- Nav ---- */
$("#menuToggle").onclick = () => $("#nav").classList.toggle("on");
document.querySelectorAll("#nav a").forEach((a) => a.onclick = () => $("#nav").classList.remove("on"));

/* ---- Announcement bar (each page sets window.EX_MSGS) ---- */
let mi = 0;
setInterval(() => {
  const m = window.EX_MSGS || []; if (m.length < 2) return;
  mi = (mi + 1) % m.length; $("#announce").textContent = m[mi];
}, 4000);

/* ---- Menu builder: chips + item rows + search ---- */
function createMenu(opts) {
  const chipsEl = $(opts.chips), listEl = $(opts.list), noRes = $(opts.noResults);
  const MENU = opts.menu;
  let active = "All", query = "";

  function renderChips() {
    chipsEl.innerHTML = "";
    ["All"].concat(MENU.filter((c) => !c.searchOnly).map((c) => c.cat)).forEach((nm) => {
      const b = document.createElement("button");
      b.className = "chip" + (nm === active ? " on" : "");
      b.textContent = nm;
      b.onclick = () => { active = nm; renderChips(); render(); };
      chipsEl.appendChild(b);
    });
  }

  function render() {
    listEl.innerHTML = "";
    let shown = 0;
    MENU.forEach((c) => {
      if (c.searchOnly && !query) return;
      if (!query && active !== "All" && c.cat !== active) return;
      const items = c.items.filter((it) => !query || (it.n + " " + (it.d || "") + " " + c.cat).toLowerCase().includes(query));
      if (!items.length) return;
      const sec = document.createElement("div");
      sec.className = "cat";
      sec.innerHTML = "<h3></h3><p class='cat-note'></p><img class='cat-img' alt='' loading='lazy'><div class='cat-grid'></div>";
      sec.querySelector("h3").textContent = c.cat;
      const nt = sec.querySelector(".cat-note"); if (c.note) nt.textContent = c.note; else nt.remove();
      const im = sec.querySelector(".cat-img"); if (c.img && !query) im.src = c.img; else im.remove();
      const grid = sec.querySelector(".cat-grid");
      items.forEach((it) => {
        shown++;
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = "<span class='ico'></span><div class='info'><h4></h4><p></p></div><div class='price'></div><button class='add'>Add</button>";
        const ico = row.querySelector(".ico"); if (it.icon) ico.textContent = it.icon; else ico.remove();
        row.querySelector("h4").textContent = it.n;
        const p = row.querySelector("p"); if (it.d) p.textContent = it.d; else p.remove();
        row.querySelector(".price").textContent = money(cents(it.p));
        row.querySelector(".add").onclick = () => addToCart(it.cartName || it.n, it.p);
        grid.appendChild(row);
      });
      listEl.appendChild(sec);
    });
    noRes.hidden = shown > 0;
  }

  // search button + panel
  const sp = $("#searchPanel"), si = $("#searchInput");
  $("#searchBtn").onclick = () => {
    sp.hidden = !sp.hidden;
    if (!sp.hidden) { si.focus(); listEl.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else { si.value = ""; query = ""; render(); }
  };
  si.oninput = () => { query = si.value.trim().toLowerCase(); render(); };

  renderChips(); render();
}

renderCart();
