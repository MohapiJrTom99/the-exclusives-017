/* =====================================================
   THE EXCLUSIVES 017 - BAKERY MENU (bakery.html)
   To change a price or item, edit the lines below.
   Prices are in rands, e.g. 12 or 4.50.
   The phone number is at the top of common.js.
   ===================================================== */

const MENU = [
  { cat: "Fresh Bakes", items: [
      { n: "White Bread", p: 12, icon: "🍞" },
      { n: "Brown Bread", p: 12, icon: "🍞" },
      { n: "Mosbolletjies / School Buns (x6)", p: 12, icon: "🥯" },
      { n: "Scones", p: 3, icon: "🥐" },
      { n: "Sponge Cake", p: 4, icon: "🍰" },
      { n: "Jam Tart", p: 4, icon: "🥧" },
      { n: "Oat Biscuit", p: 3, icon: "🍪" }
  ]},
  { cat: "Tea & Coffee", items: [
      { n: "Antigua Gold", p: 15, icon: "☕" },
      { n: "Jacob's Gold", p: 15, icon: "☕" },
      { n: "Nescafe Gold", p: 15, icon: "☕" },
      { n: "Ricoffy", p: 10, icon: "☕" },
      { n: "Rooibos Tea", p: 10, icon: "☕" },
      { n: "5 Roses Tea", p: 10, icon: "☕" }
  ]}
];

const BUCKETS = [
  { n: "Scones", icon: "🥐", sizes: [ { l: "5L", p: 150 }, { l: "10L", p: 250 }, { l: "20L", p: 450 } ] },
  { n: "Sponge Cakes", icon: "🍰", sizes: [ { l: "5L", p: 200 }, { l: "10L", p: 300 }, { l: "20L", p: 550 } ] },
  { n: "Jam Tarts", icon: "🥧", sizes: [ { l: "5L", p: 250 }, { l: "10L", p: 350 }, { l: "20L", p: 600 } ] }
];

/* ===================== CODE BELOW (no need to edit) ===================== */

window.EX_MSGS = ["Fresh from the oven every morning", "Buckets for functions and ceremonies", "Delivery available • Order on WhatsApp", "Visit our Eats side for kotas from 11:00 am"];

// buckets also show up in search results
MENU.push({ cat: "Occasion Buckets", searchOnly: true, items: [].concat.apply([], BUCKETS.map((b) =>
  b.sizes.map((s) => ({ n: b.n + " Bucket " + s.l, p: s.p, icon: b.icon })))) });

createMenu({ menu: MENU, chips: "#chips", list: "#menuList", noResults: "#noResults" });

(function () {
  const box = $("#bucketList");
  BUCKETS.forEach((b) => {
    const d = document.createElement("div");
    d.className = "bucket";
    d.innerHTML = "<div class='b-ico'></div><h3></h3><div class='sizes'></div>";
    d.querySelector(".b-ico").textContent = b.icon;
    d.querySelector("h3").textContent = b.n;
    b.sizes.forEach((s) => {
      const r = document.createElement("div");
      r.className = "size";
      r.innerHTML = "<b></b><span class='price'></span><button class='add'>Add</button>";
      r.querySelector("b").textContent = s.l + " bucket";
      r.querySelector(".price").textContent = money(cents(s.p));
      r.querySelector(".add").onclick = () => addToCart(b.n + " Bucket " + s.l, s.p);
      d.querySelector(".sizes").appendChild(r);
    });
    box.appendChild(d);
  });
})();
