document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const generateBtn = document.getElementById('generate-btn');
    const generateYearBtn = document.getElementById('generate-year-btn');
    const calendarContainer = document.getElementById('calendar-container');
    const yearlyContainer = document.getElementById('yearly-container');

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // Populate dropdowns
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    monthSelect.value = currentMonth;

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        yearlyContainer.innerHTML = '';
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    generateYearBtn.addEventListener('click', () => {
        calendarContainer.innerHTML = '';
        yearlyContainer.innerHTML = `<h2>Jadwal 1 Tahun Penuh (${yearSelect.value})</h2>`;
        for(let i=0; i<12; i++) {
            generateCalendar(i, parseInt(yearSelect.value), true);
        }
    });

    // --- LOGIC PENJADWALAN (UPDATED) ---
    function getTasksForDate(day, dayOfWeek, weekOfMonth, isLastWeek) {
        let tasks = [];
        // dayOfWeek: 0=Minggu, 1=Senin, ..., 6=Sabtu
        // weekOfMonth: 1, 2, 3, 4, 5

        // TUGAS RUTIN MINGGUAN
        switch (dayOfWeek) {
            case 1: // Senin
                tasks.push({ text: "Weekly 1on1 with SocMed Manager", type: "meeting" });
                tasks.push({ text: "Cleanup Shooting Sesi #1", type: "shooting" });
                break;
            case 2: // Selasa
                tasks.push({ text: "Olah & sortir footage (Cleanup & MRF)", type: "postprod" });
                tasks.push({ text: "Prepare Thematic Timelapse", type: "postprod" });
                break;
            case 3: // Rabu
                tasks.push({ text: "Cleanup Shooting Sesi #2", type: "shooting" });
                break;
            case 4: // Kamis (Tugas dari Jumat dipindah ke sini)
                tasks.push({ text: "Cleanup Shooting Sesi #3 (Optional)", type: "shooting" });
                tasks.push({ text: "Select 10 best raw photos/videos of the week", type: "postprod" });
                tasks.push({ text: "Provide landscape & portrait version", type: "postprod" });
                break;
            case 5: // Jumat (Sekarang menjadi Editing Day)
                tasks.push({ text: "Editing Day", type: "editing" });
                break;
        }

        // TUGAS SPESIFIK MINGGUAN & BULANAN (Jadwal editing disesuaikan ke hari Jumat)
        switch (weekOfMonth) {
            case 1: // MINGGU 1
                if (dayOfWeek === 1 && day === 1) {
                    tasks.push({ text: "Publish Video Summary Bulan Lalu", type: "special" });
                }
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #1", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "Shoot Interview Komunitas #1", type: "shooting" }); // Dipindah ke Kamis
                if (dayOfWeek === 5) tasks.push({ text: "Edit 'Plastic Adventure of the Month' & 1 simple video", type: "editing" }); // Pindah ke Jumat
                break;
            case 2: // MINGGU 2
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #2", type: "shooting" });
                if (dayOfWeek === 4) { // Dipindah ke Kamis
                    tasks.push({ text: "Shoot Crew Profile/Interview", type: "special" });
                    tasks.push({ text: "Shoot MRF Timelapse #1", type: "shooting" });
                }
                if (dayOfWeek === 5) tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" }); // Pindah ke Jumat
                break;
            case 3: // MINGGU 3
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #3", type: "shooting" });
                 if (dayOfWeek === 4) { // Dipindah ke Kamis
                    tasks.push({ text: "Shoot 'A Day-in-the-Life' Video", type: "special" });
                    tasks.push({ text: "Shoot Interview Komunitas #2", type: "shooting" });
                }
                if (dayOfWeek === 5) tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" }); // Pindah ke Jumat
                break;
            case 4: // MINGGU 4
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #4", type: "shooting" });
                if (dayOfWeek === 4) { // Dipindah ke Kamis
                    tasks.push({ text: "Shoot MRF Timelapse #2", type: "shooting" });
                }
                if (dayOfWeek === 5) { // Pindah ke Jumat
                    tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                    tasks.push({ text: "Mulai edit Video Summary Bulan Ini", type: "editing" });
                }
                break;
        }

        // Finalisasi rekap di akhir bulan
        if (isLastWeek && dayOfWeek === 5) {
             tasks.push({ text: "Finalisasi Video Summary Bulan Ini", type: "special" });
        }

        return tasks;
    }


    // --- FUNGSI GENERATE KALENDER (Tidak ada perubahan di sini) ---
    function generateCalendar(month, year, forYearlyView = false) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 for Sunday

        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = `${months[month]} ${year}`;
        monthHeader.style.textAlign = 'center';
        monthHeader.style.gridColumn = '1 / -1';
        monthHeader.style.margin = '15px 0';
        
        if (forYearlyView) {
            calendarContainer.appendChild(monthHeader);
        } else {
             calendarContainer.innerHTML = ''; // Clear previous calendar
             calendarContainer.appendChild(monthHeader);
        }
       
        // Add day headers
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        dayNames.forEach(name => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = name;
            calendar.appendChild(dayHeader);
        });

        // Add empty cells for days before the 1st
        for (let i = 0; i < startDayOfWeek; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        // Add day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('weekend');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = i;
            dayCell.appendChild(dayNumber);
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks';
            
            const weekOfMonth = Math.ceil((i + startDayOfWeek) / 7);
            const isLastWeek = (i + 7 > daysInMonth);

            const tasks = getTasksForDate(i, dayOfWeek, weekOfMonth, isLastWeek);
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task task-${task.type}`;
                taskElement.innerHTML = `<span class="task-dot"></span>${task.text}`;
                tasksContainer.appendChild(taskElement);
            });
            
            dayCell.appendChild(tasksContainer);
            calendar.appendChild(dayCell);
        }

        if (forYearlyView) {
            yearlyContainer.appendChild(calendar);
        } else {
            calendarContainer.appendChild(calendar);
        }
    }
    
    // Generate calendar for the current month on initial load
    generateCalendar(currentMonth, currentYear);
});