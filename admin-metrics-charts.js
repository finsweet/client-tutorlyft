//Init Sessions Total Time Held Graph

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings_approved;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);
      renderChart(bookings);
    }
  }, 200);
});

// Separate function to render chart
function renderChart(bookings) {
    const monthlyMinutes = {}; // { 'YYYY-MM': totalMinutes }
    
    bookings.forEach(({ length_in_minutes, start_time }) => {
      if (typeof length_in_minutes !== "number") return;
      const monthKey = new Date(start_time).toISOString().slice(0, 7);
      if (!monthlyMinutes[monthKey]) monthlyMinutes[monthKey] = 0;
      monthlyMinutes[monthKey] += length_in_minutes;
    });
    
    const sortedMonths = Object.keys(monthlyMinutes).sort();
    const labels = sortedMonths.map(m => m.replace("-", " / "));
    const data = sortedMonths.map(m => monthlyMinutes[m]);
    
    let chartRendered = false;
    const tryRenderChart = setInterval(() => {
      const canvas = document.getElementById("metricsSessionsTimeHeld");
      if (!canvas || chartRendered) return;
    
      new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Total Minutes Booked",
            data: data,
            fill: false,
            borderColor: "#5AA571",
            backgroundColor: "#5AA571",
            tension: 0.2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Total Booked Time Per Month (Minutes)"
            },
            tooltip: {
              callbacks: {
                label: context => context.parsed.y.toLocaleString() + " minutes"
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Minutes"
              },
              ticks: {
                callback: value => value.toLocaleString()
              }
            },
            x: {
              title: {
                display: true,
                text: "Month"
              }
            }
          }
        }
      });
    
      chartRendered = true;
      clearInterval(tryRenderChart);
    }, 200);
}

//Init Bookings Created Graph
window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings_approved;

    // Check all conditions are met
    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval); // Stop checking
      renderChart(bookings);
    }
  }, 200);
});

// Separate function to render chart
function renderChart(bookings) {
    const currentYear = new Date().getFullYear();
    const monthlyCounts = new Array(12).fill(0);
    
    // Count bookings per month
    bookings.forEach(booking => {
      const date = new Date(booking.created);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
    
      if (year === currentYear) {
        monthlyCounts[month]++;
      }
    });
    
    // Render chart when canvas is ready
    let chartRendered = false;
    const tryRenderChart = setInterval(() => {
      const canvas = document.getElementById("metricsBookingsCreatedChart");
      if (!canvas || !bookings || chartRendered) return;
    
      new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
          datasets: [{
            label: "Sessions Booked",
            data: monthlyCounts,
            fill: false,
            borderColor: "#5AA571",
            backgroundColor: "#5AA571",
            tension: 0.2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              title: {
                display: true,
                text: "Session Count"
              }
            },
            x: {
              title: {
                display: true,
                text: `Month of ${currentYear}`
              }
            }
          }
        }
      });
    
      chartRendered = true;
      clearInterval(tryRenderChart);
    }, 200);
}
