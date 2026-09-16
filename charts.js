const ctx = document.getElementById("shoppingTariffChart");


// Visar procent ovanför staplarna
const dataLabels = {
  id: "dataLabels",

  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];

        ctx.save();
        ctx.fillStyle = "#1A1A1A";
        ctx.font = "800 20px Syne";
        ctx.textAlign = "center";

        ctx.fillText(
          value + " %",
          bar.x,
          bar.y - 14
        );

        ctx.restore();
      });
    });
  }
};


new Chart(ctx, {
  type: "bar",

  data: {
    labels: [
  ["FÖRE TULLEN", "FEBRUARI"],
  ["TULL INFÖRD", "JULI"]
],

    datasets: [
      {
        label: "2025",
        data: [7, 18],

        backgroundColor: "rgba(182, 197, 97, 0.45)",
        borderColor: "#B6C561",
        borderWidth: 2,
        borderRadius: 8
      },

      {
        label: "2026",
        data: [10, 8],

        backgroundColor: "rgba(75, 17, 13, 0.75)",
        borderColor: "#4B110D",
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        top: 45,
        left: 20,
        right: 20
      }
    },

    plugins: {
      legend: {
        display: true,

        labels: {
          font: {
            family: "Inter",
            size: 13,
            weight: "600"
          },

          usePointStyle: true,
          pointStyle: "rectRounded"
        }
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ${context.raw} % av svenska konsumenter`;
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 20,

        ticks: {
          stepSize: 5,

          callback: function(value) {
            return value + " %";
          }
        },

        title: {
          display: true,
          text: "Andel svenska konsumenter (%)"
        },

        grid: {
          color: "rgba(26, 26, 26, 0.08)"
        }
      },

      x: {
        grid: {
          display: false
        },

        ticks: {
          font: {
            family: "Inter",
            weight: "600"
          }
        }
      }
    }
  },

  plugins: [dataLabels]
});