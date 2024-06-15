document.addEventListener("DOMContentLoaded", function () {
  let customerData = {};
  let seatsData = [];
  let earnings = {
    luxury: 0,
    business: 0,
    economy: 0,
  };

  // Fetch customer data
  fetch("customer_data.txt")
    .then((response) => response.text())
    .then((data) => {
      const rows = data.trim().split("\n");
      rows.forEach((row) => {
        const [id, bankBalance, travelFrequency] = row.split(" ");
        customerData[id] = {
          bankBalance: parseInt(bankBalance),
          travelFrequency: parseInt(travelFrequency),
        };
      });
    })
    .catch((error) => console.error("Error fetching customer data:", error))
    .then(() => {
      // Fetch seating reservations data
      fetch("seating_reservations.txt")
        .then((response) => response.text())
        .then((data) => {
          const rows = data.trim().split("\n");

          rows.forEach((row) => {
            const [seatCode, price] = row.split("|");
            let className = "";

            if (seatCode.startsWith("A")) {
              className = "luxury-table";
            } else if (seatCode.startsWith("B")) {
              className = "business-table";
            } else if (seatCode.startsWith("C")) {
              className = "economy-table";
            }

            seatsData.push({
              seatCode,
              price: parseInt(price),
              status: "0",
            });
            addRowToTable(className, seatCode, price, "Unsold");
          });

          // Simulate seat reservation
          simulateReservations();
        })
        .catch((error) => console.error("Error fetching seating data:", error));
    });

  function addRowToTable(tableId, seatCode, price, status) {
    const table = document
      .getElementById(tableId)
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = seatCode;
    newRow.insertCell(1).textContent = price;
    newRow.insertCell(2).textContent = status;
  }

  function simulateReservations() {
    let customers = Object.keys(customerData);

    let interval = setInterval(() => {
      if (
        customers.length === 0 ||
        seatsData.every((seat) => seat.status === "1")
      ) {
        clearInterval(interval);
        return;
      }

      // Choose random seat and customers
      let availableSeats = seatsData.filter((seat) => seat.status === "0");
      let randomSeatIndex = Math.floor(Math.random() * availableSeats.length);
      let seat = availableSeats[randomSeatIndex];
      let selectedCustomers = [
        customers[Math.floor(Math.random() * customers.length)],
      ];

      if (Math.random() > 0.7) {
        // 30% chance of conflict
        selectedCustomers.push(
          customers[Math.floor(Math.random() * customers.length)]
        );
      }

      let competingCustomers = selectedCustomers.filter((customerId) => {
        return customerData[customerId].bankBalance >= seat.price;
      });

      if (competingCustomers.length > 0) {
        competingCustomers.sort((a, b) => {
          let customerA = customerData[a];
          let customerB = customerData[b];
          if (customerA.travelFrequency !== customerB.travelFrequency) {
            return customerB.travelFrequency - customerA.travelFrequency;
          } else {
            return customerB.bankBalance - customerA.bankBalance;
          }
        });

        let winner = competingCustomers[0];
        let winnerData = customerData[winner];
        if (
          competingCustomers.length > 1 &&
          winnerData.travelFrequency ===
            customerData[competingCustomers[1]].travelFrequency
        ) {
          showPopup(
            `Customer ${winner} has reserved the seat ${seat.seatCode} at Price ${winnerData.bankBalance}`,
            "success"
          );
          winnerData.bankBalance = 0;
        } else {
          if (competingCustomers.length > 1) {
            showPopup(
              `Customer ${winner} has reserved the seat ${seat.seatCode} on priority basis`,
              "success"
            );
          } else {
            showPopup(
              `Customer ${winner} has purchased the seat ${seat.seatCode} at Price ${seat.price}`,
              "success"
            );
            winnerData.bankBalance -= seat.price;
          }
        }

        seat.status = "1";
        updateTable(seat.seatCode, "Sold");
        updateEarnings(
          seat.seatCode,
          seat.price,
          winner,
          competingCustomers.length
        );
        customers = customers.filter((id) => id !== winner);
      }
    }, getRandomInterval(5000, 10000));
  }

  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateTable(seatCode, status) {
    let tables = ["luxury-table", "business-table", "economy-table"];
    for (let tableId of tables) {
      let table = document.getElementById(tableId);
      for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        if (row.cells[0].textContent === seatCode && status === "Sold") {
          row.remove();
          break; // Exit loop after removing the row
        } else if (row.cells[0].textContent === seatCode) {
          row.cells[2].textContent = status;
          break; // Exit loop after updating status
        }
      }
    }
  }
  function updateEarnings(seatCode, price, customerId, priority) {
    let earningsElement;
    if (seatCode.startsWith("A")) {
      earnings.luxury += price;
      earningsElement = document.getElementById("luxury-earnings");
    } else if (seatCode.startsWith("B")) {
      earnings.business += price;
      earningsElement = document.getElementById("business-earnings");
    } else if (seatCode.startsWith("C")) {
      earnings.economy += price;
      earningsElement = document.getElementById("economy-earnings");
    }
    earningsElement.textContent = seatCode.startsWith("A")
      ? earnings.luxury
      : seatCode.startsWith("B")
      ? earnings.business
      : earnings.economy;

    // Add record to sold seats table
    const soldSeatsTable = document.getElementById("sold-seats-table");
    const newRow = soldSeatsTable.insertRow();
    newRow.insertCell(0).textContent = seatCode;
    newRow.insertCell(1).textContent = customerId;
    newRow.insertCell(2).textContent = price;
    newRow.insertCell(3).textContent = priority;
  }

  function showPopup(message, type) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    modalMessage.className = `text-${type} mx-auto`;
    modal.style.display = "block";

    setTimeout(() => {
      modal.style.display = "none";
    }, 3000);
  }

  // Close modal on click
  document.querySelector(".close").onclick = function () {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  };
});
