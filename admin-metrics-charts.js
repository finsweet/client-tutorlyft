// Init Metrics Charts with Wized

// === Chart: Total Time Held ===
window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const monthlyMinutes = {};
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
        const canvas = document.getElementById("metricsSessionsTotalTime");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "line",
          data: {
            labels,
            datasets: [{
              label: "Total Minutes Booked",
              data,
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
  }, 200);
});

// === Chart: Cancelled Session Losses ===
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const cancellationLosses = {};
      bookings.forEach(({ internal_status, start_time, charge }) => {
        if (internal_status !== "Cancelled" || typeof charge !== "number") return;
        const monthKey = new Date(start_time).toISOString().slice(0, 7);
        if (!cancellationLosses[monthKey]) cancellationLosses[monthKey] = 0;
        cancellationLosses[monthKey] += charge;
      });

      const sortedMonths = Object.keys(cancellationLosses).sort();
      const labels = sortedMonths.map(m => m.replace("-", " / "));
      const data = sortedMonths.map(m => cancellationLosses[m]);

      let chartRendered = false;
      const tryRenderChart = setInterval(() => {
        const canvas = document.getElementById("metricsSessionsCancelledLosses");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: "Losses from Cancelled Sessions",
              data,
              backgroundColor: "#5AA571"
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Total Value of Cancellation Losses"
              },
              tooltip: {
                callbacks: {
                  label: context => "$" + context.parsed.y.toLocaleString()
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
                  text: "Lost Revenue ($)"
                },
                ticks: {
                  callback: value => "$" + value.toLocaleString()
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
  }, 200);
});

// === Chart: Cancelled Sessions Per Month ===
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const monthlyCancelled = {};
      bookings.forEach(({ internal_status, start_time }) => {
        if (internal_status !== "Cancelled") return;
        const monthKey = new Date(start_time).toISOString().slice(0, 7);
        if (!monthlyCancelled[monthKey]) monthlyCancelled[monthKey] = 0;
        monthlyCancelled[monthKey]++;
      });

      const sortedMonths = Object.keys(monthlyCancelled).sort();
      const labels = sortedMonths.map(m => m.replace("-", " / "));
      const data = sortedMonths.map(m => monthlyCancelled[m]);

      let chartRendered = false;
      const tryRenderChart = setInterval(() => {
        const canvas = document.getElementById("metricsSessionsCancelled");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: "Cancelled Sessions",
              data,
              backgroundColor: "#5AA571"
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Cancelled Sessions Per Month"
              },
              tooltip: {
                callbacks: {
                  label: context => context.parsed.y.toLocaleString() + " cancelled"
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
                  text: "Cancelled Sessions"
                },
                ticks: {
                  stepSize: 1,
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
  }, 200);
});

// === Chart: Monthly Revenue ===
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings_approved;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const monthlyRevenue = {};
      bookings.forEach(({ charge, start_time }) => {
        if (typeof charge !== "number") return;
        const monthKey = new Date(start_time).toISOString().slice(0, 7);
        if (!monthlyRevenue[monthKey]) monthlyRevenue[monthKey] = 0;
        monthlyRevenue[monthKey] += charge;
      });

      const sortedMonths = Object.keys(monthlyRevenue).sort();
      const labels = sortedMonths.map(m => m.replace("-", " / "));
      const data = sortedMonths.map(m => monthlyRevenue[m]);

      let chartRendered = false;
      const tryRenderChart = setInterval(() => {
        const canvas = document.getElementById("metricsFinancialsRevenue");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "line",
          data: {
            labels,
            datasets: [{
              label: "Monthly Revenue",
              data,
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
                text: "Revenue Per Month"
              },
              tooltip: {
                callbacks: {
                  label: context => "$" + context.parsed.y.toLocaleString()
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
                  text: "Revenue ($)"
                },
                ticks: {
                  callback: value => "$" + value.toLocaleString()
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
  }, 200);
});

// === Chart: Monthly Payouts ===
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings_approved;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const monthlyPayout = {};
      bookings.forEach(({ payout, start_time }) => {
        if (typeof payout !== "number") return;
        const monthKey = new Date(start_time).toISOString().slice(0, 7);
        if (!monthlyPayout[monthKey]) monthlyPayout[monthKey] = 0;
        monthlyPayout[monthKey] += payout;
      });

      const sortedMonths = Object.keys(monthlyPayout).sort();
      const labels = sortedMonths.map(m => m.replace("-", " / "));
      const data = sortedMonths.map(m => monthlyPayout[m]);

      let chartRendered = false;
      const tryRenderChart = setInterval(() => {
        const canvas = document.getElementById("metricsFinancialsPayouts");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "line",
          data: {
            labels,
            datasets: [{
              label: "Monthly Payout",
              data,
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
                text: "Payout Per Month"
              },
              tooltip: {
                callbacks: {
                  label: context => "$" + context.parsed.y.toLocaleString()
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
                  text: "Payout ($)"
                },
                ticks: {
                  callback: value => "$" + value.toLocaleString()
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
  }, 200);
});

// === Chart: Monthly Commissions ===
window.Wized.push((Wized) => {
  const interval = setInterval(() => {
    const path = window.location.pathname;
    const isLoaded = document.readyState === "complete";
    const data = Wized.data?.r?.metrics_all_booking?.data;
    const bookings = data?.all_bookings_approved;

    if (path === "/tutor/earnings" && isLoaded && Array.isArray(bookings) && bookings.length > 0) {
      clearInterval(interval);

      const monthlyCommission = {};
      bookings.forEach(({ commission, start_time }) => {
        if (typeof commission !== "number") return;
        const monthKey = new Date(start_time).toISOString().slice(0, 7);
        if (!monthlyCommission[monthKey]) monthlyCommission[monthKey] = 0;
        monthlyCommission[monthKey] += commission;
      });

      const sortedMonths = Object.keys(monthlyCommission).sort();
      const labels = sortedMonths.map(m => m.replace("-", " / "));
      const data = sortedMonths.map(m => monthlyCommission[m]);

      let chartRendered = false;
      const tryRenderChart = setInterval(() => {
        const canvas = document.getElementById("metricsFinancialsCommissions");
        if (!canvas || chartRendered) return;

        new Chart(canvas.getContext("2d"), {
          type: "line",
          data: {
            labels,
            datasets: [{
              label: "Monthly Commission",
              data,
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
                text: "Commission Per Month"
              },
              tooltip: {
                callbacks: {
                  label: context => "$" + context.parsed.y.toLocaleString()
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
                  text: "Commission ($)"
                },
                ticks: {
                  callback: value => "$" + value.toLocaleString()
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
  }, 200);
});