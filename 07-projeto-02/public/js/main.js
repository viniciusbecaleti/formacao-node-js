// const categoryTable = document.querySelector("table#category")

// if (categoryTable) {
//   categoryTable.addEventListener("click", async (event) => {
//     const button = event.target

//     if (!button.hasAttribute("type")) {
//       return
//     }

//     const id = button.dataset.id

//     const response = await fetch(`http://localhost:5500/admin/categories/delete/${id}`, { method: "DELETE" })
//     const { message } = await response.json()

//     if (message === "success") {
//       location.reload()
//     }
//   })
// }
