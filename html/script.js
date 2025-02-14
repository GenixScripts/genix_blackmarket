const categories = [
    { id: "weapons", label: "WEAPONS", icon: "fa-gun" },
    { id: "drugs", label: "DRUGS", icon: "fa-pills" },
    { id: "tools", label: "TOOLS", icon: "fa-tools" },
    { id: "other", label: "Other", icon: "fa-cube" },
  ]
  
  let currentCategoryIndex = 0
  let items = {}
  
  function updateCategories() {
    const categoriesContainer = document.getElementById("categories")
    categoriesContainer.innerHTML = ""
  
    for (let i = 0; i < 3; i++) {
      const index = (currentCategoryIndex + i) % categories.length
      const category = categories[index]
  
      const li = document.createElement("li")
      li.innerHTML = `<i class="fas ${category.icon}"></i> ${category.label}`
      li.dataset.categoryId = category.id
      if (i === 0) li.classList.add("active")
  
      li.addEventListener("click", () => {
        document.querySelectorAll("#categories li").forEach((el) => el.classList.remove("active"))
        li.classList.add("active")
        updateItems(category.id)
      })
  
      categoriesContainer.appendChild(li)
    }
  }
  
  function updateItems(categoryId) {
    const container = document.getElementById("itemsContainer")
    container.innerHTML = ""
  
    if (!items[categoryId]) return
  
    items[categoryId].forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "store__content_items-item"
  
      itemElement.innerHTML = `
              <img src="nui://ox_inventory/web/images/${item.name}.png" onerror="this.src='assets/default.png'">
              <h1>${item.label}</h1>
              <h2>$${item.price.toLocaleString()}</h2>
              <h3>${item.description}</h3>
              <button class="buy-button" onclick="buyItem('${categoryId}', '${item.name}', 1)">
                  <i class="fas fa-shopping-cart"></i> BUY
              </button>
          `
      container.appendChild(itemElement)
    })
  }
  
  document.getElementById("prevCategory").addEventListener("click", () => {
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length
    updateCategories()
    updateItems(categories[currentCategoryIndex].id)
  })
  
  document.getElementById("nextCategory").addEventListener("click", () => {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length
    updateCategories()
    updateItems(categories[currentCategoryIndex].id)
  })
  
  document.querySelector(".close-button").addEventListener("click", () => {
    fetch(`https://${GetParentResourceName()}/exit`, {
      method: "POST",
    })
  })
  
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    const themeIcon = document.querySelector(".theme-toggle i")
    if (document.body.classList.contains("dark-theme")) {
      themeIcon.classList.replace("fa-moon", "fa-sun")
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon")
    }
  })
  
  function buyItem(categoryId, itemName, amount) {
    const item = items[categoryId].find((i) => i.name === itemName)
    if (item) {
      fetch(`https://${GetParentResourceName()}/buyItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: item,
          amount: amount,
        }),
      }).then(() => {
        fetch(`https://${GetParentResourceName()}/exit`, {
          method: "POST",
        })
      })
    }
  }
  
  window.addEventListener("message", (event) => {
    if (event.data.type === "ui") {
      const container = document.querySelector(".container")
      if (event.data.status) {
        items = event.data.items
        document.getElementById("playerMoney").textContent = event.data.cash.toLocaleString()
        container.classList.add("active")
        updateCategories()
        updateItems(categories[currentCategoryIndex].id)
      } else {
        container.classList.remove("active")
      }
    }
  })
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fetch(`https://${GetParentResourceName()}/exit`, {
        method: "POST",
      })
    }
  })
  
  function GetParentResourceName() {
    return "genix_blackmarket"
  }
  
  updateCategories()
  
  
