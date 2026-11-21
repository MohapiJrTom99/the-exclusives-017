/* =====================================================
   THE EXCLUSIVES 017 - EATS MENU (index.html)
   To change a price or item, edit the lines below.
   Prices are in rands, e.g. 40 or 34.99.
   The phone number is at the top of common.js.
   ===================================================== */

const MENU = [
  { cat: "Kota Menu", img: "images/kota-3.jpg",
    note: "All kotas come on egg-toasted bread with chips, cheese and egg.",
    items: [
      { n: "Beef Patty Kota", d: "Beef patty, lettuce, cucumber, tomato and sauce", p: 40 },
      { n: "Russian Kota", d: "Russian, lettuce, cucumber, tomato and sauce", p: 45 },
      { n: "Rib Burger Kota", d: "Rib burger, lettuce, cucumber, tomato and red onion", p: 50 },
      { n: "Rib Burger & Russian Kota", d: "Rib burger, Russian, lettuce, cucumber, tomato and red onion", p: 75 },
      { n: "Loaded Kota", d: "Rib burger, bacon or chicken roll, Russian, lettuce, cucumber, tomato, grated cheddar and red onion", p: 100 }
    ]},
  { cat: "Extra Kota Builds", items: [
      { n: "Chicken Roll", p: 6 }, { n: "Bacon", p: 9 }, { n: "Russian", p: 22 }, { n: "Rib Burger", p: 25 },
      { n: "Avo Spread", p: 5 }, { n: "Cheese Sauce", p: 7 }, { n: "Egg", p: 5 }, { n: "Cheese", p: 5 }
    ]},
  { cat: "Cheese Boys", img: "images/fries-1.jpg",
    note: "The Cheese Boys | Food Spot",
    items: [
      { n: "Cheese Boys (Medium)", d: "Grated cheddar, chopped bacon, Russian, jalapeno, red onion, chips and sauces", p: 70 },
      { n: "Cheese Boys (Large)", d: "Grated cheddar, extra chopped bacon, 3 Russian, jalapeno, red onion, large chips and sauces", p: 150 }
    ]},
  { cat: "Chips", items: [ { n: "Russian and Chips", p: 40 } ]},
  { cat: "Burgers", items: [
      { n: "Single Cheese Burger", p: 34.99 },
      { n: "Single Cheese Burger + Ama Fries", p: 44.99 },
      { n: "Double Cheese Burger", p: 54.99 },
      { n: "Double Cheese Burger + Ama Fries", p: 64.99 },
      { n: "Double Bacon Cheese", p: 69.99 },
      { n: "Double Bacon Cheese Burger + Ama Fries", p: 79.99 }
  ]},
  { cat: "Wraps", items: [
      { n: "Chicken Wrap", p: 34.99 },
      { n: "Chicken Wrap + Ama Fries", p: 44.99 },
      { n: "Beef Wrap", p: 34.99 },
      { n: "Beef Wrap + Ama Fries", p: 44.99 }
  ]},
  { cat: "Mains", items: [
      { n: "Quarter Chicken + Pap + 2 Sides", p: 49.99 },
      { n: "Quarter Chicken + Ama Fries", p: 49.99 },
      { n: "Half Chicken", p: 64.99 },
      { n: "Full Chicken", p: 94.99 },
      { n: "Half Chicken + Pap + 2 Sides", p: 74.99 },
      { n: "Full Chicken + Pap + 2 Sides", p: 119.99 },
      { n: "Full Chicken + Ama Fries", p: 119.99 },
      { n: "Steak + Pap + 2 Sides", p: 54.99 },
      { n: "Steak & Ama Medium Fries", p: 54.99 },
      { n: "Steak & Wors + Ama Medium Fries", p: 64.99 },
      { n: "Steak & Wors + Pap + 2 Sides", p: 64.99 },
      { n: "Wors + Pap + 2 Sides", p: 39.99 },
      { n: "Beef Stew + Pap/Rice + 2 Sides", p: 49.99 }
  ]},
  { cat: "Drinks", items: [
      { n: "500ml Flavoured Mocktail", p: 35 },
      { n: "500ml Flavoured Cocktail", p: 45 }
  ]}
];

const SPECIAL = [
  { n: "6 Wings & Fries", p: 60 },
  { n: "10 Wings & Fries", p: 110 },
  { n: "16 Wings & Fries", p: 160 }
];

const PLATTERS = [
  { n: "Feast for 2", p: 194.99, inc: ["10 wings", "300g steak", "300g wors"] },
  { n: "Feast for 4", p: 299.99, inc: ["16 wings", "Half chicken", "600g steak", "600g wors"] },
  { n: "Feast for 6", p: 449.99, inc: ["24 wings", "Full chicken", "800g steak", "600g wors"] },
  { n: "Feast for 8", p: 649.99, inc: ["32 wings", "2 full chickens", "1kg steak", "1kg wors"] }
];

/* ===================== CODE BELOW (no need to edit) ===================== */

window.EX_MSGS = ["Delivery now available \u2022 Order on WhatsApp", "Fresh bakery every morning \u2022 see our Bakery", "Weekend Special: 6 wings & fries R60", "Kota from R40"];

/* Wings and platters also appear in search results */
MENU.push({ cat: "Weekend Special", searchOnly: true, items: SPECIAL.map((s) => ({ n: s.n, p: s.p, cartName: "Weekend Special: " + s.n })) });
MENU.push({ cat: "Meat Platters", searchOnly: true, items: PLATTERS.map((x) => ({ n: x.n, d: x.inc.join(", "), p: x.p, cartName: x.n + " (" + x.inc.join(", ") + ")" })) });

createMenu({ menu: MENU, chips: "#chips", list: "#menuList", noResults: "#noResults" });

(function () {
  const box = $("#dealOpts");
  SPECIAL.forEach((s) => {
    const d = document.createElement("div");
    d.className = "deal-opt";
    d.innerHTML = "<b></b><span class='price'></span><button class='add'>Add</button>";
    d.querySelector("b").textContent = s.n;
    d.querySelector(".price").textContent = money(cents(s.p));
    d.querySelector(".add").onclick = () => addToCart("Weekend Special: " + s.n, s.p);
    box.appendChild(d);
  });
  const pb = $("#platterList");
  PLATTERS.forEach((x) => {
    const d = document.createElement("div");
    d.className = "platter";
    d.innerHTML = "<h4></h4><ul></ul><div class='price'></div><button class='btn btn-black'>Add to order</button>";
    d.querySelector("h4").textContent = x.n;
    x.inc.forEach((t) => { const li = document.createElement("li"); li.textContent = t; d.querySelector("ul").appendChild(li); });
    d.querySelector(".price").textContent = money(cents(x.p));
    d.querySelector(".btn").onclick = () => addToCart(x.n + " (" + x.inc.join(", ") + ")", x.p);
    pb.appendChild(d);
  });
})();
