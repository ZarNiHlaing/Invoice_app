//selector
const products = [
  {
    id: 1,
    name: "Apple",
    price: 1200,
  },
  {
    id: 2,
    name: "Orange",
    price: 1400,
  },
  {
    id: 3,
    name: "Mango",
    price: 900,
  },

  {
    id: 4,
    name: "lime",
    price: 50,
  },

  // {
  //     id: 4,
  //     name: "Lime",
  //     price: 50,
  // },
  // {
  //     id: 5,
  //     name: "lemon",
  //     price: 500,
  // },
];

let rowCount = 1;
const taxRate = 0.15;

//selector

const app = document.querySelector("#app");
const newRecord = document.querySelector("#newRecord");
const product = document.querySelector("#product");
const quantity = document.querySelector("#quantity");
const records = document.querySelector("#records");
const recordRows = document.querySelector("#record-rows");
const recordTotal = document.querySelector(".records-total");
const inventories = document.querySelector("#inventories");
const newItem = document.querySelector("#newItem");
const newItemName = document.querySelector("#newItemName");
const newItemPrice = document.querySelector("#newItemPrice");

//function

const createItem = (name, price) => {
  const div = document.createElement("div");
  div.className =
    " item-list border border-2 p-3 mb-3 d-flex justify-content-between";
  div.innerHTML = `
 <p class="mb-0 item-name">${name}</p>
 <p class="mb-0 text-black-50 item-price">${price}</p>
 `;
  return div;
};

const createRecordRow = (productId, quantity) => {
  //informationcollection
  const currentProduct = products.find((el) => el.id == productId);
  let cost = currentProduct.price * quantity.valueAsNumber;
  const tableRow = document.createElement("tr");
  tableRow.classList.add("record-row");
  tableRow.setAttribute("product-id", productId);
  tableRow.innerHTML = `
    <td class="record-no" ></td>
    <td class="text-start record-product">${currentProduct.name}</td>
    <td class="text-end record-price">${currentProduct.price}</td>
    <td class="text-end  ">
    <span>
    <i class=" record-quantity-control record-quantity-decrement bi bi-dash"></i>
    </span>
    <span class="record-quantity">${quantity.valueAsNumber}
    </span>
    <span>
    <i class=" record-quantity-control record-quantity-increment bi bi-plus"></i>
    </span>
    </td>
    <td class="text-end position-relative ">
    <span class="record-cost"> ${cost}</span>

    <button class="btn btn-sm btn-primary record-row-del position-absolute d-print-none">
        <i class="bi bi-trash3"></i>
    </button></td>
    `;

  tableRow.querySelector(".record-row-del").addEventListener("click", () => {
    if (confirm("Are you sure want to remove?")) {
      tableRow.classList.add("animate__animated", "animate__fadeOut");
      tableRow.addEventListener("animationend", () => {
        tableRow.remove();
        calculateTotal(); //update calc
      });
    }
  });

   // quantity decrease
   tableRow.querySelector(".record-quantity-decrement")
   .addEventListener("click", () => {
     const recordQuantity = tableRow.querySelector(".record-quantity");
     let Quantity = recordQuantity.innerText;
     if (Quantity >= 1) {
       Quantity = parseFloat(recordQuantity.innerText) - 1;
       // recordQuantity = parseFloat(recordQuantity.innerText) - 1;
       recordQuantity.innerText = Quantity;
       const recordCost = tableRow.querySelector(".record-cost");
       recordCost.innerText = currentProduct.price * Quantity;
       calculateTotal();
       CurrentTax();
     }
   });

 // quantity increase
 tableRow.querySelector(".record-quantity-increment").addEventListener("click", () => {
     const recordQuantity = tableRow.querySelector(".record-quantity");
     let Quantity = recordQuantity.innerText;
     if (Quantity > 0) {
     Quantity = parseFloat(recordQuantity.innerText) + 1;
       recordQuantity.innerText = Quantity;
       const recordCost = tableRow.querySelector(".record-cost");
       recordCost.innerText = currentProduct.price * Quantity;
       calculateTotal();
       CurrentTax();
     }
   });

//  const recordQuentityIncrement = table.querySelector

  return tableRow;

  
};






//calculate total
const calculateTotal = () => {
  recordTotal.innerText = [...document.querySelectorAll(".record-cost")].reduce(
    (pv, cv) => pv + parseFloat(cv.innerText),
    0
  );
  // let total = 0;
  // const allRecords = document.querySelectorAll(".record-cost");
  // allRecords.forEach(el => {
  // console.log(el);
  //     total += parseFloat(el.innerHTML)
  // })
  // recordTotal.innerText = total;
};


//process


// calculate Tax
const CurrentTax = () => {
  const recordTax = document.querySelector(".records-tax");
  recordTax.innerText = (recordTotal.innerText * 5) / 100;
  // console.log(Tax);

  // calculate subtotal
  const subTotal = document.querySelector(".subTotal");

  subTotal.innerText =
    parseFloat(recordTax.innerText) + parseFloat(recordTotal.innerText);
};

//generate product
products.forEach((el) => {
  const newOption = document.createElement("option");
  product.append(new Option(el.name, el.id));
  inventories.append(createItem(el.name, el.price));
});



//add record (existed or not_)

newRecord.addEventListener("submit", (e) => {
  e.preventDefault();
  const isExistedRow = document.querySelector(
    `[product-id='${product.value}']`
  );

  if (isExistedRow) {
    let currentPrice = isExistedRow.querySelector(".record-price");
    let currentQuantity = isExistedRow.querySelector(".record-quantity");
    let currentCost = isExistedRow.querySelector(".record-cost");

    let newQuantity = parseFloat(currentQuantity.innerText) + quantity.valueAsNumber;
    let newCost = currentPrice.innerText * newQuantity;

    currentQuantity.innerText = newQuantity;
    currentCost.innerText = newCost;
  } else {

    //new row create
    recordRows.append(createRecordRow(product.value, quantity));
  }

  //clear form
  newRecord.reset();

  //claculate total cost
  calculateTotal();

  //calculate tax
  CurrentTax();

  //   console.log(allRecords);

  //console.log(cost);
  //console.log("hello");
  //console.log(products.find(el => el.id == product.value));
});


//product update
newItem.addEventListener("submit", (e) => {
  e.preventDefault();

  //product array update
  let newItemId = products[products.length - 1].id + 1;
  const newItemObj = {
    id: newItemId,
    name: newItemName.value,
    price: newItemPrice.valueAsNumber,
  };
  products.push(newItemObj);

  //form reset
  newItem.reset();

  //ui update
  product.append(new Option(newItemObj.name, newItemObj.id));
  inventories.append(createItem(newItemObj.name, newItemObj.price));
  console.log(products);
});



