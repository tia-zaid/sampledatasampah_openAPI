document.addEventListener('DOMContentLoaded', function() {
    // ELEMEN UTAMA
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const generateBtn = document.getElementById('generate-btn');
    const generateYearBtn = document.getElementById('generate-year-btn');
    const calendarContainer = document.getElementById('calendar-container');
    const yearlyContainer = document.getElementById('yearly-container');

    // MODIFIKASI DIMULAI: Elemen Modal
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.querySelector('.close-btn');
    const saveEventBtn = document.getElementById('save-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const eventText = document.getElementById('event-text');
    const eventType = document.getElementById('event-type');
    const eventDateInput = document.getElementById('event-date');
    // MODIFIKASI SELESAI

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

    // --- EVENT LISTENERS ---
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

    // MODIFIKASI DIMULAI: Event Listener untuk Modal
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    saveEventBtn.addEventListener('click', saveCustomEvent);
    deleteEventBtn.addEventListener('click', deleteLastCustomEvent);
    // MODIFIKASI SELESAI

    // --- LOGIC PENYIMPANAN EVENT CUSTOM ---
    function getCustomEvents() {
        const events = localStorage.getItem('customEvents');
        return events ? JSON.parse(events) : {};
    }

    function saveCustomEvent() {
        const date = eventDateInput.value;
        const text = eventText.value.trim();
        const type = eventType.value;

        if (!text) {
            alert('Nama kegiatan tidak boleh kosong!');
            return;
        }

        const customEvents = getCustomEvents();
        if (!customEvents[date]) {
            customEvents[date] = [];
        }
        customEvents[date].push({ text, type });
        localStorage.setItem('customEvents', JSON.stringify(customEvents));

        modal.style.display = 'none';
        eventText.value = '';
        // Re-generate kalender untuk menampilkan event baru
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    }
    
    function deleteLastCustomEvent() {
        const date = eventDateInput.value;
        const customEvents = getCustomEvents();

        if (customEvents[date] && customEvents[date].length > 0) {
            customEvents[date].pop(); // Hapus item terakhir
            if (customEvents[date].length === 0) {
                delete customEvents[date]; // Hapus key jika array kosong
            }
            localStorage.setItem('customEvents', JSON.stringify(customEvents));
            modal.style.display = 'none';
            generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
        } else {
            alert('Tidak ada kegiatan tambahan untuk dihapus pada tanggal ini.');
        }
    }


    // --- LOGIC PENJADWALAN OTOMATIS (Sama seperti sebelumnya) ---
    function getTasksForDate(day, dayOfWeek, weekOfMonth, isLastWeek) {
        let tasks = [];
        // dayOfWeek: 0=Minggu, 1=Senin, ..., 6=Sabtu
        switch (dayOfWeek) {
            case 1: tasks.push({ text: "Weekly 1on1 with SocMed Manager", type: "meeting" }, { text: "Cleanup Shooting Sesi #1", type: "shooting" }); break;
            case 2: tasks.push({ text: "Olah & sortir footage (Cleanup & MRF)", type: "postprod" }, { text: "Prepare Thematic Timelapse", type: "postprod" }); break;
            case 3: tasks.push({ text: "Cleanup Shooting Sesi #2", type: "shooting" }); break;
            case 4: tasks.push({ text: "Cleanup Shooting Sesi #3 (Optional)", type: "shooting" }, { text: "Select 10 best raw photos/videos", type: "postprod" }, { text: "Provide landscape & portrait version", type: "postprod" }); break;
            case 5: tasks.push({ text: "Editing Day", type: "editing" }); break;
        }
        switch (weekOfMonth) {
            case 1:
                if (dayOfWeek === 1 && day === 1) tasks.push({ text: "Publish Video Summary Bulan Lalu", type: "special" });
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #1", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "Shoot Interview Komunitas #1", type: "shooting" });
                if (dayOfWeek === 5) tasks.push({ text: "Edit 'Plastic Adventure of the Month' & 1 simple video", type: "editing" });
                break;
            case 2:
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #2", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "Shoot Crew Profile/Interview", type: "special" }, { text: "Shoot MRF Timelapse #1", type: "shooting" });
                if (dayOfWeek === 5) tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                break;
            case 3:
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #3", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "Shoot 'A Day-in-the-Life' Video", type: "special" }, { text: "Shoot Interview Komunitas #2", type: "shooting" });
                if (dayOfWeek === 5) tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                break;
            case 4:
                if (dayOfWeek === 3) tasks.push({ text: "Shoot 'Before & After' #4", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "Shoot MRF Timelapse #2", type: "shooting" });
                if (dayOfWeek === 5) tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" }, { text: "Mulai edit Video Summary Bulan Ini", type: "editing" });
                break;
        }
        if (isLastWeek && dayOfWeek === 5) tasks.push({ text: "Finalisasi Video Summary Bulan Ini", type: "special" });
        return tasks;
    }


    // --- FUNGSI GENERATE KALENDER (Dimodifikasi untuk handle klik dan event custom) ---
    function generateCalendar(month, year, forYearlyView = false) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new D ate(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const customEvents = getCustomEvents(); // Ambil data event custom

        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = `${months[month]} ${year}`;
        monthHeader.style.textAlign = 'center';
        monthHeader.style.gridColumn = '1 / -1';
        monthHeader.style.margin = '15px 0';
        
        if (forYearlyView) yearlyContainer.appendChild(monthHeader);
        else {
            calendarContainer.innerHTML = '';
            calendarContainer.appendChild(monthHeader);
        }
       
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        dayNames.forEach(name => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = name;
            calendar.appendChild(dayHeader);
        });

        for (let i = 0; i < startDayOfWeek; i++) calendar.appendChild(document.createElement('div'));

        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay();
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            dayCell.addEventListener('click', () => {
                modalTitle.textContent = `Tambah Kegiatan untuk ${i} ${months[month]} ${year}`;
                eventDateInput.value = dateString;
                eventText.value = ''; // Kosongkan input field
                modal.style.display = 'flex';
                eventText.focus();
            });

            if (dayOfWeek === 0 || dayOfWeek === 6) dayCell.classList.add('weekend');

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = i;
            dayCell.appendChild(dayNumber);
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks';
            
            const weekOfMonth = Math.ceil((i + startDayOfWeek) / 7);
            const isLastWeek = (i + 7 > daysInMonth);

            // Gabungkan task otomatis dan task custom
            let allTasks = getTasksForDate(i, dayOfWeek, weekOfMonth, isLastWeek);
            if (customEvents[dateString]) {
                allTasks = allTasks.concat(customEvents[dateString]);
            }
            
            allTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task task-${task.type}`;
                taskElement.innerHTML = `<span class="task-dot"></span>${task.text}`;
                tasksContainer.appendChild(taskElement);
            });
            
            dayCell.appendChild(tasksContainer);
            calendar.appendChild(dayCell);
        }

        if (forYearlyView) yearlyContainer.appendChild(calendar);
        else calendarContainer.appendChild(calendar);
    }
    
    // Generate calendar untuk bulan ini saat halaman pertama kali dibuka
    generateCalendar(currentMonth, currentYear);
});