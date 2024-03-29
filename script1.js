document.addEventListener("DOMContentLoaded", function () {
  // Define your tire size limits ORIGINAL MAP!!!
  // const tireLimits = new Map([
  //   ["385", 2],
  //   ["295", 8],
  //   ["11R", 15],
  //   ["315", 5],
  //   ["305", 6],
  //   ["275", 10],
  //   ["265", 4],
  //   ["255", 4],
  //   ["245", 4],
  //   ["235", 4],
  //   ["215", 4],
  //   ["205", 4],
  //   ["195", 4],
  //   // Add other tire size limits here
  // ]);
  const tireLimits = new Map([
    ["385", 2],
    ["295", 8],
    ["11R", 16],
    // ["315", 8],
    ["305 or 315", 10],
    ["275", 11],
    ["265", 4],
    ["255", 4],
    ["245", 4],
    ["235", 6],
    ["215", 4],
    ["205", 4],
    ["195", 4],
    // Add other tire size limits here
  ]);

  // Initialize variables to track loads and tire counts|!!!!IMPORTANT!!!! changes to length is the number of loads calculated (3 loads p/d, 15 loads p/w)
  const loads = Array.from({ length: 15 }, () => []); 
  const remainingTires = new Map();

  // Function to create customer input fields
  function createCustomerInput() {
    const customerInputContainer = document.getElementById("customerInputs");
    const customerInput = document.createElement("div");
    customerInput.classList.add("customer-input");

    customerInput.innerHTML = `
        <label for="customerName" class="required" id="customerLabel">Customer Name:</label>
        <select class="customer-name" required>
            <option value="All Coast Tyre Service">All Coast Tyre Service</option>
            <option value="Black Rubber Sydney">Black Rubber Sydney</option>
            <option value="Bobs Tyre Service">Bobs Tyre Service</option>
            <option value="Buslines Northern Rivers">Buslines Northern Rivers</option>
            <option value="Buslines Tamworth">Buslines Tamworth</option>
            <option value="Doncal">Doncal</option>
            <option value="Followmont">Followmont</option>
            <option value="JPT">JPT</option>
            <option value="Karremens">Karremens</option>
            <option value="Martins">Martins</option>
            <option value="Mitch's Mobile Tyre Service">Mitch's Mobile Tyre Service</option>
            <option value="PVT Careys">PVT Careys</option>
            <option value="PVT Stockmasters">PVT Stockmasters</option>
            <option value="PVT Tamworth">PVT Tamworth</option>
            <option value="Ryanies">Ryanies</option>
            <option value="Samreen / Caseys">Samreen / Caseys</option>
            <option value="Stock Retreads">Stock Retreads</option>
            <option value="Treadwell">Treadwell</option>
            <option value="Tuff Tyres FNQ">Tuff Tyres FNQ</option>
            <option value="Tully Tyre Service">Tully Tyre Service</option>
            <option value="Tyres & More">Tyres & More</option>
            <option value="Tyre Evolution">Tyre Evolution</option>
            <option value="Tyreright Rocklea">Tyreright Rocklea</option>
            <option value="Tyreright Lytton">Tyreright Lytton</option>
            <option value="Tyreright Yatala">Tyreright Yatala</option>
            <option value="Tyreright Townsville">Tyreright Townsville</option>
            <option value="Tyres & More">Tyres & More</option>
            <option value="Wickham Freight Lines">Wickham Freight Lines</option>
            <option value="Wises">Wises</option>
            <!-- Add other customer options here -->
          </select>

        <label for="tireSize" id="sizeLabel">Tyre Size:</label>
        <select class="tire-size" required>
        <option value="385">385</option>
        <option value="305 or 315">305 or 315</option>
        <option value="295">295</option>
        <option value="11R">11R</option>
        <option value="275">275</option>
        <option value="265">265</option>
        <option value="255">255</option>
        <option value="245">245</option>
        <option value="235">235</option>
        <option value="215">215</option>
        <option value="205">205</option>
        <option value="195">195</option>
        <!-- Add other tire size options here -->
        </select>

        <label for="quantity" class="required" id="quantityLabel">Quantity:</label>
        <input type="number" class="quantity" required />

        <label for="completionDate" class="required" id="completionLabel">Completion Date:</label>
        <input type="date" class="completion-date" required />

        <button type="button" class="remove-customer">Remove</button>
      `;

      customerInputContainer.appendChild(customerInput);

    // Add event listener to remove customer button
    const removeButton = customerInput.querySelector(".remove-customer");
    removeButton.addEventListener("click", () => {
      customerInputContainer.removeChild(customerInput);
    });
  }

  // Handle "Add Customer" button click
  const addCustomerButton = document.getElementById("addCustomer");
  addCustomerButton.addEventListener("click", createCustomerInput);

  // Handle "Calculate" button click
  const calculateButton = document.getElementById("calculate");
  calculateButton.addEventListener("click", () => calculateLoadsOverDays(5));

  // Provided code for calculating loads over multiple days
  function calculateLoadsForSingleDay() {
    // Reset variables for a single day
    loads.forEach((load) => (load.length = 0));
    remainingTires.clear();

    // Get all customer input fields and convert to an array
    const customerInputs = Array.from(document.querySelectorAll(".customer-input"));

    // Sort customer inputs by completion date in ascending order
    customerInputs.sort((a, b) => {
      const dateA = new Date(a.querySelector(".completion-date").value);
      const dateB = new Date(b.querySelector(".completion-date").value);
      return dateA - dateB;
    });

    customerInputs.forEach((customerInput) => {
      const customerName = customerInput.querySelector(".customer-name").value;
      const tireSize = customerInput.querySelector(".tire-size").value;
      let quantity = parseInt(customerInput.querySelector(".quantity").value, 10);

      while (quantity > 0) {
        const loadIndex = loads.findIndex((load) => {
          const sizeLimit = tireLimits.get(tireSize) || 0;
          const sizeCountInLoad = load.filter((tire) => tire.size === tireSize).length;
          return sizeCountInLoad < sizeLimit && load.length < 22;
        });

        if (loadIndex !== -1) {
          const load = loads[loadIndex];
          load.push({ size: tireSize, customer: customerName });
          quantity--;
        } else {
          // If no load can accommodate this tire size, move it to remainingTires
          const existingQuantity = remainingTires.get(tireSize) || 0;
          remainingTires.set(tireSize, existingQuantity + 1);
          quantity--;
        }
      }
    });

    // Display the load lists
    displayLoadLists();
  }

  function calculateLoadsOverDays(numDays) {
    for (let day = 1; day <= numDays; day++) {
      calculateLoadsForSingleDay();
    }
  }

  // Helper function to get the count of a specific tire size in a load
  function getTireSizeCount(load, tireSize) {
    return load.filter((tire) => tire.size === tireSize).length;
  }

  // Helper function to get the limit of a specific tire size
  function getTireSizeLimit(tireSize) {
    return tireLimits.get(tireSize) || 0;
  }

  // Function to display load lists
  function displayLoadLists() {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    for (let i = 0; i < loads.length; i++) {
      const loadNumber = i + 1;
      const loadHTML = document.createElement("div");
      loadHTML.innerHTML = `<h3>Load ${loadNumber}</h3>`;
      const loadContents = document.createElement("ul");

      loads[i].forEach((tire) => {
        const tireItem = document.createElement("li");
        tireItem.textContent = `${tire.customer}: ${tire.size}`;
        loadContents.appendChild(tireItem);
      });

      loadHTML.appendChild(loadContents);
      resultsContainer.appendChild(loadHTML);
    }

    // Display remaining tires
    const remainingHTML = document.createElement("div");
    remainingHTML.innerHTML = "<h3>Remaining Tires</h3>";
    const remainingContents = document.createElement("ul");

    remainingTires.forEach((quantity, tireSize) => {
      const tireItem = document.createElement("li");
      tireItem.textContent = `${tireSize}: ${quantity}`;
      remainingContents.appendChild(tireItem);
    });

    remainingHTML.appendChild(remainingContents);
    resultsContainer.appendChild(remainingHTML);
  }

  // ----------------------------------------------------------------------CSV FILE DOWNLOAD
  // Handle "Export to Excel" button click
  const exportButton = document.getElementById("exportExcel");
  exportButton.addEventListener("click", exportToExcel);

  function exportToExcel() {
    const wb = XLSX.utils.book_new();

    // Create a worksheet for loads
    const loadsData = loads.flatMap((load, loadIndex) =>
      load.map((tire) => [loadIndex + 1, tire.customer, tire.size])
    );
    const loadsWS = XLSX.utils.aoa_to_sheet([["Load Number", "Customer", "Tire Size"], ...loadsData]);

    // Create a worksheet for remaining tires
    const remainingData = Array.from(remainingTires, ([tireSize, quantity]) => [
      "Remaining Tires",
      "",
      `${tireSize}: ${quantity}`,
    ]);
    const remainingWS = XLSX.utils.aoa_to_sheet([["Load Number", "Customer", "Tire Size"], ...remainingData]);

    // Add worksheets to the workbook
    XLSX.utils.book_append_sheet(wb, loadsWS, "Loads");
    XLSX.utils.book_append_sheet(wb, remainingWS, "Remaining Tires");

    // Save the workbook to a file
    XLSX.writeFile(wb, "tire_loads.xlsx");
  }
});

