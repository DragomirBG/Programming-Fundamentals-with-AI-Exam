document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const trInput = document.getElementById('total-revenue');
    const aovInput = document.getElementById('avg-order-value');
    const lrrInput = document.getElementById('lead-response-rate');
    const prrInput = document.getElementById('prospect-response-rate');
    
    // Sliders display
    const lrrDisplay = document.getElementById('lead-rate-display');
    const prrDisplay = document.getElementById('prospect-rate-display');
    
    // Cards
    const prospectsValue = document.getElementById('prospects-value');
    const leadsValue = document.getElementById('leads-value');
    const customersValue = document.getElementById('customers-value');
    
    const leadsPercent = document.getElementById('leads-percent');
    const customersPercent = document.getElementById('customers-percent');
    
    const leadsFill = document.getElementById('leads-fill');
    const customersFill = document.getElementById('customers-fill');

    // Chart
    const chartContainer = document.getElementById('chart-container');
    const xAxisContainer = document.getElementById('chart-x-axis');
    const tooltip = document.getElementById('chart-tooltip');
    
    const startInput = document.getElementById('campaign-start');
    const endInput = document.getElementById('campaign-end');

    function calculate() {
        const TR = parseFloat(trInput.value) || 0;
        const AOV = parseFloat(aovInput.value) || 1;
        const LRR = parseFloat(lrrInput.value) || 1;
        const PRR = parseFloat(prrInput.value) || 1;
        
        // Formula 01
        const customers = Math.round(TR / AOV);
        
        // Formula 02
        const leads = Math.round(customers * 100 / LRR);
        
        // Formula 03
        const prospects = Math.round(leads * 100 / PRR);
        
        // Percentages
        const leadsPct = Math.round((leads / prospects) * 100) || 0;
        const customersPct = Math.round((customers / prospects) * 100) || 0;

        // Update cards
        prospectsValue.textContent = prospects;
        leadsValue.textContent = leads;
        customersValue.textContent = customers;
        
        leadsPercent.textContent = leadsPct + '%';
        customersPercent.textContent = customersPct + '%';
        
        leadsFill.style.width = leadsPct + '%';
        customersFill.style.width = customersPct + '%';
        
        // Update slider texts
        lrrDisplay.textContent = lrrInput.value;
        prrDisplay.textContent = prrInput.value;
        
        updateChart(prospects, leads, customers);
    }

    function updateChart(totalProspects, totalLeads, totalCustomers) {
        chartContainer.innerHTML = '';
        xAxisContainer.innerHTML = '';
        
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        
        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (months <= 0) months = 1;
        if (months > 12) months = 12; // cap for display
        
        // Draw X Axis
        const steps = 6;
        for(let i=0; i<=steps; i++) {
            const val = Math.round((totalProspects / steps) * i);
            const div = document.createElement('div');
            div.textContent = val + ' people';
            xAxisContainer.appendChild(div);
        }

        // Draw Bars
        for (let i = 1; i <= months; i++) {
            const row = document.createElement('div');
            row.className = 'chart-row';
            
            const label = document.createElement('div');
            label.className = 'chart-row-label';
            label.textContent = i;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'bar-wrapper';
            
            // Calculate accumulating values
            const curP = Math.round((totalProspects / months) * i);
            const curL = Math.round((totalLeads / months) * i);
            const curC = Math.round((totalCustomers / months) * i);
            
            const pBar = document.createElement('div');
            pBar.className = 'bar bar-prospects';
            pBar.style.width = (curP / totalProspects * 100) + '%';
            
            const lBar = document.createElement('div');
            lBar.className = 'bar bar-leads';
            lBar.style.width = (curL / totalProspects * 100) + '%';
            
            const cBar = document.createElement('div');
            cBar.className = 'bar bar-customers';
            cBar.style.width = (curC / totalProspects * 100) + '%';
            
            wrapper.appendChild(pBar);
            wrapper.appendChild(lBar);
            wrapper.appendChild(cBar);
            
            row.appendChild(label);
            row.appendChild(wrapper);
            
            // Hover logic
            row.addEventListener('mouseenter', (e) => {
                tooltip.style.display = 'block';
                tooltip.innerHTML = `Month #${i}<br>Prospects: ${curP}<br>Leads: ${curL}<br>Customers: ${curC}`;
                positionTooltip(e);
            });
            row.addEventListener('mousemove', positionTooltip);
            row.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            chartContainer.appendChild(row);
        }
    }

    function positionTooltip(e) {
        const x = e.clientX;
        const y = e.clientY;
        tooltip.style.left = (x + 15) + 'px';
        tooltip.style.top = (y - 15) + 'px';
    }

    // Bind events
    const inputs = [trInput, aovInput, lrrInput, prrInput, startInput, endInput];
    inputs.forEach(input => input.addEventListener('input', calculate));

    // Init
    calculate();
});