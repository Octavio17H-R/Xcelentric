function dibujarGraficaCrecimiento5Anios() {
    const ctx = document.getElementById('graficaGanancias').getContext('2d');

    const escenarios = ['p','b','o'];
    const labels = ['Mes 1', 'Mes 12', 'Mes 24', 'Mes 36', 'Mes 48', 'Mes 60'];

    // Colores ajustados para buena visibilidad
    const colores = {
        p: { border: '#F9D342', bg: '#FFF9C4', point: '#F9A825' }, // amarillo principal
        b: { border: '#FFB74D', bg: '#FFE0B2', point: '#FF9800' }, // amarillo secundario/naranja suave
        o: { border: '#90A4AE', bg: '#CFD8DC', point: '#607D8B' }  // gris-azulado
    };

    const datasets = escenarios.map(s => {
        const utilidadMensual = parseFloat(document.getElementById(`r4_${s}`).value.replace(/[$,%]/g,'')) || 0;
        const exit = parseFloat(document.getElementById(`v8_5_${s}`).value.replace(/[$,%]/g,'')) || 0;

        const data = [];
        for(let i=0; i<6; i++){
            if(i < 5){
                data.push(utilidadMensual * 12 * (i+1)); // acumulado anual
            } else {
                data.push(exit); // exit final
            }
        }

       const nombresEscenario = { p: 'Pesimista', b: 'Base', o: 'Optimista' };

        return {
            label: nombresEscenario[s],
            data,
            fill: false,
            borderColor: colores[s].border,
            backgroundColor: colores[s].bg,
            tension: 0.3,
            pointRadius: 6,
            pointBackgroundColor: colores[s].point,
            borderWidth: 3,
        };
    });

    if(window.miGrafica) window.miGrafica.destroy();

    window.miGrafica = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Proyección de ganancias a 5 años',
                    color: '#37474F', // gris oscuro más legible
                    font: { size: 16, weight: '700' }
                },
                legend: {
                    labels: {
                        color: '#37474F',
                        font: { size: 12, weight: '600' }
                    }
                },
                tooltip: {
                    backgroundColor: '#37474F',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    callbacks: {
                        label: function(context){
                            return '$' + Number(context.raw).toLocaleString('es-MX', {minimumFractionDigits:0});
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Monto ($)',
                        color: '#37474F',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#607D8B' } // gris medio para ticks
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo',
                        color: '#37474F',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#607D8B' }
                }
            }
        }
    });
}