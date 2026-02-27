
    const fmt = (n) => '$' + n.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});
    
    function calculate() {
        ['p', 'b', 'o'].forEach(s => {
            // 1. Premisas
            const n = parseFloat(document.getElementById(`v1_${s}`).value) || 0;
            const k = parseFloat(document.getElementById(`v3_${s}`).value) || 0;
            const pvp = parseFloat(document.getElementById(`v4_${s}`).value) || 0;
            const ce = parseFloat(document.getElementById(`v5_${s}`).value) || 0;
            const period = parseFloat(document.getElementById(`v9_${s}`).value) || 60;
            
            const ingE = n * k * pvp;
            document.getElementById(`v6_${s}`).value = (((pvp-ce)/pvp)*100).toFixed(2) + '%';
            document.getElementById(`v10_${s}`).value = fmt(ingE);

            // 2. CAPEX
            let capex = 0;
            for(let i=1; i<=7; i++) capex += parseFloat(document.getElementById(`c${i}_${s}`).value) || 0;
            const amort = capex / period;
            const equipos = parseFloat(document.getElementById(`c4_${s}`).value) || 0;
            document.getElementById(`c8_${s}`).value = fmt(equipos * 0.20);
            document.getElementById(`c10_${s}`).value = fmt(capex);
            document.getElementById(`c11_${s}`).value = fmt(amort);

            // 3. OPEX
            let opexTotal = 0;
            for(let i=1; i<=9; i++) opexTotal += parseFloat(document.getElementById(`o${i}_${s}`).value) || 0;
            document.getElementById(`o10_${s}`).value = fmt(opexTotal);

            // 4. EXTRA (Corregido IDs para evitar TypeError)
            let extraTotal = 0;
            for(let i=1; i<=5; i++) {
                extraTotal += parseFloat(document.getElementById(`e${i}_${s}`).value) || 0;
            }
            document.getElementById(`e6_${s}`).value = fmt(extraTotal);

            // 5. RENTABILIDAD
            const totalIng = ingE + extraTotal;
            const costoET = n * k * ce;
            const royVar = ingE * 0.15;
            const util = totalIng - costoET - royVar - opexTotal - amort;

            document.getElementById(`r1_${s}`).value = fmt(totalIng);
            document.getElementById(`r2_${s}`).value = fmt(costoET);
            document.getElementById(`r3_${s}`).value = fmt(royVar);
            document.getElementById(`r4_${s}`).value = fmt(util); 
//------------------------------------------seccion 2 ---------------------------------
                    // --- LÓGICA BLOQUES 6 AL 10 ---
         // ================= BLOQUE 6 – ESCALABILIDAD =================

        // Utilidad base mensual (Excel)
        const utilidadBase = util;

        if (n > 0) {

            // Utilidad mensual escalada a 10 unidades
            const utilidad10 = (utilidadBase ) * 10;
            document.getElementById(`v6_2_${s}`).value = fmt(utilidad10);

            // Año óptimo de escalabilidad
            const anioOptimo = (utilidadBase * 12 > 25000)
                ? "Year 1"
                : "Year 2";

            document.getElementById(`v6_3_${s}`).value = anioOptimo;

        } else {

            document.getElementById(`v6_2_${s}`).value = fmt(0);
            document.getElementById(`v6_3_${s}`).value = "N/A";
        }

        // ================= BLOQUE 7 – ACUMULADOS =================
        const acumulado5 = extraTotal * 12 * 5;
        const reinversion = acumulado5 * (Math.pow(1.07, 5) - 1);

        document.getElementById(`v7_1_${s}`).value = fmt(acumulado5);
        document.getElementById(`v7_2_${s}`).value = fmt(reinversion);

        // ================= BLOQUE 8 – EXIT =================
        const contrato7 = util * 84;
        const multiplo = parseFloat(document.getElementById(`v8_2_${s}`).value) || 0;
        const precioVenta = (util + amort) * 12*5;
        // Plus fijo por escenario
        const plusEscala = (s === 'p') ? 15 : (s === 'b') ? 25 : 40;

        document.getElementById(`v8_1_${s}`).value = fmt(contrato7);
        document.getElementById(`v8_3_${s}`).value = fmt(precioVenta);
        document.getElementById(`v8_4_${s}`).value = fmt(plusEscala);
        document.getElementById(`v8_5_${s}`).value = fmt(acumulado5*(1 + multiplo));

        // ================= BLOQUE 9 – VALOR POR PLAZA =================
// ================= BLOQUE 9 – VALOR POR PLAZA (CORREGIDO) =================

        // Inversión inicial por plaza
        const valorInicial = 100000;

        // --- Exit base (ya lo calculaste antes) ---
        const exitBase = precioVenta;

        // --- Plus por escalabilidad como % ---
        const plusEscalaPct =
            (s === 'p') ? 0.15 :
            (s === 'b') ? 0.25 :
                        0.40;

        // Exit final con escalabilidad
        const exitFinal = exitBase * (1 + plusEscalaPct);

        // Valor final por plaza (10 plazas)
        const valorFinalPlaza = exitFinal / 10;

        // Plusvalía (múltiplo)
        const plusvalia = valorInicial > 0
            ? (valorFinalPlaza / valorInicial)
            : 0;

        // Tiempo de retorno (meses)
        const paybackMeses = util > 0
            ? (capex / util)
            : Infinity;

        // “TIR” operativa (ROI anual equivalente)
        const tirOperativa = capex > 0
            ? ((util * 12) / capex * 100)
            : 0;

        // Outputs
        document.getElementById(`v9_1_${s}`).value = tirOperativa.toFixed(2) + '%';
        document.getElementById(`v9_2_${s}`).value =
            (isFinite(paybackMeses) ? paybackMeses.toFixed(1) : 'N/A') + ' meses';
        document.getElementById(`v9_3_${s}`).value = fmt(valorInicial);
        document.getElementById(`v9_4_${s}`).value = fmt(valorFinalPlaza);
        document.getElementById(`v9_5_${s}`).value = plusvalia.toFixed(2) + 'x';


                // ===== RESUMEN SUPERIOR DE PLUSVALÍA =====
        // ===== RESUMEN SUPERIOR DE PLUSVALÍA (BASE) =====
        const inversionInicial = valorInicial; // 100,000
        const horizonteAnios = 5;

        document.getElementById('pv_inv_b').textContent = fmt(inversionInicial);
        document.getElementById('pv_t_b').textContent = horizonteAnios + ' años';



            // ================= BLOQUE 10 – COMISIONES =================
        const comisionFija = 0;                 // si existe input editable, aquí se lee
        const comisionVariable = ingE * 0.02;   // 2% sobre venta electricidad

        const referidosEstimados = 0;           // si existe input editable, aquí se lee
        const comisionPorReferido = 1500;
        const comisionReferidos = referidosEstimados * comisionPorReferido;

        const totalComisiones = comisionFija + comisionVariable + comisionReferidos;

        document.getElementById(`v10_1_${s}`).value = fmt(comisionFija);
        document.getElementById(`v10_2_${s}`).value = fmt(comisionVariable);
        document.getElementById(`v10_3_${s}`).value = referidosEstimados;
        document.getElementById(`v10_4_${s}`).value = fmt(comisionReferidos);
        document.getElementById(`v10_5_${s}`).value = fmt(totalComisiones);
        
        });
        // ===== RESUMEN ESTRATÉGICO (3 PILARES) =====
        ['p','b','o'].forEach(s => {

            // Pilar 1: Utilidad neta mensual
            document.getElementById(`kpi_u_${s}`).textContent =
                document.getElementById(`r4_${s}`).value;

            // Pilar 2: Plusvalía / Exit
            document.getElementById(`kpi_x_${s}`).textContent =
                document.getElementById(`v8_5_${s}`).value;

            // Pilar 3: Comisiones
            document.getElementById(`kpi_c_${s}`).textContent =
                document.getElementById(`v10_5_${s}`).value;

        });
        dibujarGraficaCrecimiento5Anios();
        }

        
       function resetEditable() {
    // Resetea inputs editables normales
    document.querySelectorAll('.edit').forEach(input => input.value = input.defaultValue);

    // Resetea controles de escenarios
    document.getElementById('ctrl_p').value = 2;
    document.getElementById('ctrl_b').value = 4;
    document.getElementById('ctrl_o').value = 6;

    // Sincroniza los escenarios con la tabla
    syncScenario('p', 2);
    syncScenario('b', 4);
    syncScenario('o', 6);

    // Recalcula todo lo demás
    calcularTodo();
}

       
    // Listener para actualizar en tiempo real
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculate);
    });

function syncScenario(suffix, value) {
    value = Math.max(1, Math.min(12, Number(value) || 1));

    document.getElementById(`ctrl_${suffix}`).value = value;
    document.getElementById(`v1_${suffix}`).value = value;

    calculate();
}

function stepScenario(suffix, delta){
    const input = document.getElementById(`ctrl_${suffix}`);
    syncScenario(suffix, Number(input.value) + delta);
}




    
    window.onload = calculate;
