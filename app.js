// --- Mock Data ---
const mockData = [
    {
        id: 1, category: "육성제품", model: "스타일러", channel: "혼매", name: "26년형 스타일러 런칭 기념 POP", status: "시안 확인 중", date: "2026.03.03",
        uploadHistory: [
            { date: "2026.03.03 11:00", uploader: "김HSAD (kim@hsad.co.kr)", filename: "POP_시안_v2.png", remarks: "수정본" },
            { date: "2026.03.02 14:20", uploader: "이HSAD (lee@hsad.co.kr)", filename: "POP_시안_v1.png", remarks: "최초 등록" }
        ],
        distHistory: [
            { date: "2026.03.04 09:15", uploader: "박HSAD (park@hsad.co.kr)", filename: "매장리스트_POP-2026-0001_20260304.xlsx", remarks: "10개 매장 반영" },
            { date: "2026.03.01 16:00", uploader: "김HSAD (kim@hsad.co.kr)", filename: "매장리스트_1차.xlsx", remarks: "최초 업로드" }
        ]
    },
    {
        id: 2, category: "RAC", model: "에어컨", channel: "혼매", name: "에어컨 사전예약 POP", status: "발주 완료", date: "2026.03.02",
        uploadHistory: [
            { date: "2026.03.02 10:00", uploader: "박HSAD (park@hsad.co.kr)", filename: "AC_reserve_v1.png", remarks: "최초 등록" }
        ],
        distHistory: [
            { date: "2026.03.02 11:30", uploader: "박HSAD (park@hsad.co.kr)", filename: "AC_stores_final.xlsx", remarks: "최종 확정" }
        ]
    },
    {
        id: 3, category: "PC", model: "PC존", channel: "혼매", name: "그램 신모델 전시 POP", status: "시안 수정중", date: "2026.02.26",
        uploadHistory: [
            { date: "2026.02.26 15:30", uploader: "최HSAD (choi@hsad.co.kr)", filename: "Gram_New_v2.jpg", remarks: "수정본" },
            { date: "2026.02.25 09:15", uploader: "최HSAD (choi@hsad.co.kr)", filename: "Gram_New_v1.jpg", remarks: "최초 등록" }
        ],
        distHistory: []
    },
    {
        id: 4, category: "TV", model: "TV존", channel: "전매", name: "OLED Evo 기획전", status: "시안 컨펌 완료", date: "2026.02.24",
        uploadHistory: [
            { date: "2026.02.24 16:45", uploader: "정HSAD (jung@hsad.co.kr)", filename: "OLED_Evo_final.png", remarks: "최종본" },
            { date: "2026.02.23 11:20", uploader: "정HSAD (jung@hsad.co.kr)", filename: "OLED_Evo_v1.png", remarks: "최초 등록" }
        ],
        distHistory: [
            { date: "2026.02.24 17:00", uploader: "정HSAD (jung@hsad.co.kr)", filename: "TV_promo_stores.xlsx", remarks: "매장 목록 반영" }
        ]
    }
];

const mockStores = [
    { no: 163, trade: "이마트 태백점", name: "(신)이마트 태백점", courier: "CJ 대한통운", tracking: "6962-6033-0123", qty: 25 },
    { no: 162, trade: "이마트 제천점", name: "(신)이마트 제천점", courier: "CJ 대한통운", tracking: "6962-6033-0112", qty: 30 },
    { no: 161, trade: "이마트 제주점", name: "(신)이마트 제주점", courier: "CJ 대한통운", tracking: "6962-6033-0101", qty: 40 },
    { no: 160, trade: "이마트 신제주점", name: "(신)이마트 신제주점", courier: "CJ 대한통운", tracking: "6962-6033-0090", qty: 20 },
];

let distributedQty = 0; // Total quantity already distributed

// --- View Toggling ---
const app = {
    switchView: function (viewId) {
        // 1. View Section Toggling
        const viewMap = {
            'dashboard': 'dashboardView',
            'popList': 'listView',
            'popDetail': 'detailView',
            'fixtureRequests': 'fixtureRequestsView',
            'fixtureReqDetailPage': 'fixtureReqDetailPageView',
            'fixtureStatus': 'fixtureStatusView',
            'fixtureStatusDetailPage': 'fixtureStatusDetailPageView'
        };

        const targetId = viewMap[viewId] || viewId;

        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // 2. Sidebar Navigation State Management
        const allMenuItems = document.querySelectorAll('.snb-menu li');
        const allSubLinks = document.querySelectorAll('.sub-menu-list a');

        allMenuItems.forEach(li => li.classList.remove('active'));
        allSubLinks.forEach(a => a.classList.remove('active-sub'));

        // Handle specific view states
        if (viewId === 'dashboard') {
            const dashLi = document.getElementById('menu-dashboard');
            if (dashLi) dashLi.classList.add('active');

            // Close all accordions when going to dashboard
            document.querySelectorAll('.has-sub').forEach(li => li.classList.remove('open'));
        } else if (viewId === 'popList' || viewId === 'popDetail') {
            const parent = document.getElementById('parent-pop');
            if (parent) {
                parent.classList.add('active');
                parent.classList.add('open');
            }
            const sub = document.getElementById('sub-popList');
            if (sub) sub.classList.add('active-sub');
        } else if (viewId === 'fixtureRequests' || viewId === 'fixtureReqDetailPage') {
            const parent = document.getElementById('parent-req');
            if (parent) {
                parent.classList.add('active');
                parent.classList.add('open');
            }
            const sub = document.getElementById('sub-fixtureRequests');
            if (sub) sub.classList.add('active-sub');

            // Initialize rendering if going to the list view
            if (viewId === 'fixtureRequests') {
                app.setFixtureViewMode('card');
            }
        } else if (viewId === 'fixtureStatus' || viewId === 'fixtureStatusDetailPage') {
            const parent = document.getElementById('parent-req');
            if (parent) {
                parent.classList.add('active');
                parent.classList.add('open');
            }
            const sub = document.getElementById('sub-fixtureStatus');
            if (sub) sub.classList.add('active-sub');

            // Special initialization for fixture status table
            if (viewId === 'fixtureStatus' && typeof renderFixtureStatusTable === 'function') {
                renderFixtureStatusTable();
            }
        }

        window.scrollTo(0, 0);
    },

    toggleSubMenu: function (parentId) {
        const parentLi = document.getElementById(parentId);
        if (!parentLi) return;

        const isOpen = parentLi.classList.contains('open');

        // Accordion effect: Close others
        document.querySelectorAll('.has-sub').forEach(li => {
            if (li.id !== parentId) li.classList.remove('open');
        });

        if (isOpen) {
            parentLi.classList.remove('open');
        } else {
            parentLi.classList.add('open');
        }
    },

    showDetailView: function (itemIndex = null) {
        document.getElementById('listView').classList.remove('active');
        document.getElementById('detailView').classList.add('active');
        // reset tabs to first
        const tabBtn = document.querySelector('.tab-btn[data-target="tab-basic"]');
        if (tabBtn) tabBtn.click();

        // Render history if item selected
        if (itemIndex !== null) {
            renderUploadHistory(mockData[itemIndex].uploadHistory);
            renderDistHistory(mockData[itemIndex].distHistory);
        }
    },

    showListView: function () {
        document.getElementById('detailView').classList.remove('active');
        document.getElementById('listView').classList.add('active');
    }
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderTable(mockData);
    setupImageUpload();
    setupTabs();
    // Start with dashboard
    app.switchView('dashboard');
});

// --- List View Rendering ---
function renderTable(data) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    document.getElementById('totalCount').innerText = data.length;

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') app.showDetailView(index);
        };

        tr.innerHTML = `
            <td><input type="checkbox" onclick="event.stopPropagation()"></td>
            <td>${item.id}</td>
            <td>${item.category}</td>
            <td>${item.model}</td>
            <td>${item.channel}</td>
            <td style="text-align: left; font-weight:500;">${item.name}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function searchData() {
    // mock search visual feedback
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerText;
    btn.innerText = "검색 중...";
    setTimeout(() => {
        btn.innerText = originalText;
    }, 500);
}

function resetFilters() {
    document.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
}

// --- Upload History Logic ---
function renderUploadHistory(history) {
    const latestInfo = document.getElementById('latestHistoryInfo');
    const tbody = document.getElementById('historyTableBody');
    const historySection = document.getElementById('historySection');

    if (!history || history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    historySection.style.display = 'block';

    // Latest Info
    const latest = history[0];
    latestInfo.innerText = `${latest.date} ${latest.uploader} ${latest.filename}`;

    // Table Data
    tbody.innerHTML = '';
    history.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.uploader}</td>
            <td>${item.filename}</td>
            <td>${item.remarks}</td>
        `;
        tbody.appendChild(tr);
    });

    // Reset container (closed by default)
    document.getElementById('historyTableContainer').classList.remove('active');
    const toggleBtn = document.querySelector('.history-toggle-btn');
    toggleBtn.innerHTML = "<i class='bx bx-chevron-down'></i> 전체 이력 <span>보기</span>";
}

function toggleHistory() {
    const container = document.getElementById('historyTableContainer');
    const btn = document.querySelector('.history-toggle-btn');
    const isActive = container.classList.toggle('active');

    if (isActive) {
        btn.innerHTML = "<i class='bx bx-chevron-up'></i> 전체 이력 <span>접기</span>";
    } else {
        btn.innerHTML = "<i class='bx bx-chevron-down'></i> 전체 이력 <span>보기</span>";
    }
}

function renderDistHistory(history) {
    const latestInfo = document.getElementById('latestDistHistoryInfo');
    const tbody = document.getElementById('distHistoryTableBody');
    const historySection = document.getElementById('distHistorySection');

    if (!history || history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    historySection.style.display = 'block';

    const latest = history[0];
    latestInfo.innerText = `${latest.date} ${latest.uploader} ${latest.filename}`;

    tbody.innerHTML = '';
    history.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.uploader}</td>
            <td>${item.filename}</td>
            <td>${item.remarks}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('distHistoryTableContainer').classList.remove('active');
    const toggleBtn = document.querySelector('#distHistorySection .history-toggle-btn');
    toggleBtn.innerHTML = "<i class='bx bx-chevron-down'></i> 전체 이력 <span>보기</span>";
}

function toggleDistHistory() {
    const container = document.getElementById('distHistoryTableContainer');
    const btn = document.querySelector('#distHistorySection .history-toggle-btn');
    const isActive = container.classList.toggle('active');

    if (isActive) {
        btn.innerHTML = "<i class='bx bx-chevron-up'></i> 전체 이력 <span>접기</span>";
    } else {
        btn.innerHTML = "<i class='bx bx-chevron-down'></i> 전체 이력 <span>보기</span>";
    }
}

// --- Tabs ---
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active to current
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    renderStoreTable();
    calculateStock();
}

// --- Order & Stock Management ---
function renderStoreTable() {
    const tbody = document.getElementById('storeTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    distributedQty = 0;

    mockStores.forEach((store) => {
        distributedQty += store.qty;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${store.no}</td>
            <td>-</td>
            <td>-</td>
            <td>${store.trade}</td>
            <td>${store.name}</td>
            <td><input type="text" value="${store.courier}" style="width:100px; text-align:center;"></td>
            <td><input type="text" value="${store.tracking}" style="width:140px; text-align:center;"></td>
            <td><input type="number" value="${store.qty}" style="width:60px; text-align:center;" onchange="updateDistributedQty(this, ${store.qty})"></td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateStock() {
    const totalQtyInput = document.getElementById('totalQtyInput');
    const stockInput = document.getElementById('stockInput');

    if (totalQtyInput && stockInput) {
        const total = parseInt(totalQtyInput.value) || 0;
        const stock = total - distributedQty;
        stockInput.value = stock;
    }
}

function updateDistributedQty(inputElement, oldVal) {
    const newVal = parseInt(inputElement.value) || 0;
    distributedQty = distributedQty - oldVal + newVal;
    // Update the mock store data conceptually here. Next, we recalculate stock.
    calculateStock();
}

function openVendorModal() {
    document.getElementById('vendorModal').style.display = 'flex';
}

function closeVendorModal() {
    document.getElementById('vendorModal').style.display = 'none';
}

function openAddOrderModal() {
    const qty = prompt('추가 발주 수량을 입력하세요:');
    if (!qty || isNaN(qty)) return;
    const reason = prompt('추가 발주 사유를 입력하세요:');
    if (!reason) return;

    const tbody = document.getElementById('addOrderTableBody');
    const rowCount = tbody ? tbody.querySelectorAll('tr').length + 1 : 1;
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${rowCount}차</td>
        <td style="color: #A50034; font-weight: 600;">${parseInt(qty).toLocaleString()}</td>
        <td style="text-align:left;">${reason}</td>
        <td>${dateStr}</td>
        <td>-</td>
        <td><span class="status-badge status-pending">승인대기</span></td>
    `;
    if (tbody) tbody.appendChild(tr);
    alert(`[${rowCount}차 추가발주 요청 완료]\n수량: ${qty}개\n사유: ${reason}\n담당자 승인 진행 예정입니다.`);
}


function sendOrderEmail() {
    const vendorSelect = document.getElementById('modalVendorSelect');
    const selectedVendor = vendorSelect.value;

    if (!selectedVendor || selectedVendor.trim() === "") {
        alert('제작 업체를 선택해주세요.');
        return;
    }

    // Set timestamp
    const now = new Date();
    const timeString = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Update UI
    document.getElementById('orderDateInput').value = timeString;
    document.getElementById('vendorInput').value = selectedVendor;

    // Update Timeline Step
    const steps = document.querySelectorAll('#orderStatusSteps .step');
    steps[0].classList.add('completed');
    steps[1].classList.add('active'); // 제작 중

    alert(`[발주 완료]\n선택하신 업체(${selectedVendor})로 최종 원고데이터 및 발주 요청 메일이 전송되었습니다.`);
    closeVendorModal(); //
}

// --- Order & Stock Management ---
// --- Image Upload Preview ---
function setupImageUpload() {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');

    fileInput.addEventListener('change', handleFileSelect);

    // Simple drag and drop styling
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#f0f0f0';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#FAFAFA';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#FAFAFA';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert("이미지 파일(JPG, PNG, GIF)만 업로드 가능합니다.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('imagePreview');
        const text = document.querySelector('.preview-text');
        const removeBtn = document.getElementById('removeImgBtn');

        img.src = e.target.result;
        img.style.display = 'block';
        removeBtn.style.display = 'flex';
        text.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    const fileInput = document.getElementById('fileInput');
    const img = document.getElementById('imagePreview');
    const text = document.querySelector('.preview-text');
    const removeBtn = document.getElementById('removeImgBtn');

    fileInput.value = '';
    img.src = '';
    img.style.display = 'none';
    removeBtn.style.display = 'none';
    text.style.display = 'block';
}

// --- Feedback & Status Automation ---
function submitFeedback() {
    const roleSelect = document.getElementById('simulatedRole');
    const role = roleSelect.options[roleSelect.selectedIndex].text;
    const roleValue = roleSelect.value;
    const input = document.getElementById('feedbackInput');
    const text = input.value;

    if (!text.trim()) return;

    // Create comment item
    const list = document.querySelector('.comment-list');
    const now = new Date();
    const timeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<strong>${role}</strong> <span class="date">${timeStr}</span><p>${text}</p>`;
    list.appendChild(item);

    // Clear input
    input.value = '';
    list.scrollTop = list.scrollHeight;

    // Status mapping & Notification
    const statusInput = document.getElementById('statusInput');

    if (roleValue === '디자인팀') {
        statusInput.value = '시안 수정중';
        alert('[시스템 알림] 디자인팀에서 피드백을 등록했습니다.\n담당 현장대리인에게 알림이 발송되었습니다.');
    } else if (roleValue === '현장대리인') {
        statusInput.value = '시안 확인 중';
    }
}

function confirmDraft() {
    const roleValue = document.getElementById('simulatedRole').value;
    if (roleValue !== '디자인팀') {
        alert('시안 컨펌은 디자인팀 권한입니다. (테스트를 위해 가상 롤을 디자인팀으로 변경해주세요)');
        return;
    }

    const statusInput = document.getElementById('statusInput');
    statusInput.value = '시안 컨펌 완료';
    alert('[발주 가능]\n시안이 최종 컨펌되었습니다. 이제 원고 데이터를 업로드하고 발주를 진행하실 수 있습니다.');
}

// ============================================================
// Fixture Request Management
// ============================================================
const fixtureRequestMockData = [
    {
        id: 'FX-2026-001',
        date: '2026.03.05',
        prodGroup: '키즈존',
        store: '신 홈플러스 전주완산점',
        fixtureName: '키즈존',
        type: 'VMD 집기',
        qty: 1,
        installDate: '2026.03.15',
        completeDate: '-',
        status: '검토중',
        approvalStep: 0
    },
    {
        id: 'FX-2026-002',
        date: '2026.03.04',
        prodGroup: 'TV/오디오',
        store: '신 홈플러스 전북전주점',
        fixtureName: '상업용 디스플레이',
        type: '마케팅 집기',
        qty: 2,
        installDate: '2026.03.20',
        completeDate: '-',
        status: '마케팅팀 승인완료',
        approvalStep: 1
    },
    {
        id: 'FX-2026-003',
        date: '2026.03.02',
        prodGroup: 'PC/ODD',
        store: '신 홈플러스 광양점',
        fixtureName: 'LG 그램 노트북',
        type: '마케팅 집기',
        qty: 3,
        installDate: '2026.03.18',
        completeDate: '2026.03.05',
        status: 'HSAD 확인완료',
        approvalStep: 3
    },
    {
        id: 'FX-2026-004',
        date: '2026.03.01',
        prodGroup: '연출 집기',
        store: '신 홈플러스 순천점',
        fixtureName: '연출 집기_캠핑',
        type: 'VMD 집기',
        qty: 1,
        installDate: '2026.03.10',
        completeDate: '-',
        status: '취소됨',
        approvalStep: -1
    }
];

let currentFixtureReqIndex = null;
let currentFixtureViewMode = 'card'; // default

// Handle multi-select toggle
function toggleMultiSelect(el) {
    el.classList.toggle('active');
}

// Close multi-select on outside click
document.addEventListener('click', function (e) {
    const multiSelects = document.querySelectorAll('.multi-select-custom');
    multiSelects.forEach(ms => {
        if (!ms.contains(e.target)) {
            ms.classList.remove('active');
        }
    });
});

app.setFixtureViewMode = function (mode) {
    currentFixtureViewMode = mode;
    const tableWrap = document.getElementById('fixtureTableWrap');
    const cardWrap = document.getElementById('fixtureCardWrap');
    const btnList = document.getElementById('btnViewList');
    const btnCard = document.getElementById('btnViewCard');

    if (mode === 'list') {
        tableWrap.style.display = 'block';
        cardWrap.style.display = 'none';
        btnList.className = 'btn btn-primary btn-sm';
        btnCard.className = 'btn btn-outline btn-sm';
    } else {
        tableWrap.style.display = 'none';
        cardWrap.style.display = 'grid';
        btnList.className = 'btn btn-outline btn-sm';
        btnCard.className = 'btn btn-primary btn-sm';
    }

    // Rerender both
    renderFixtureRequestTable();
    renderFixtureRequestCards();
};

const statusBadgeMap = {
    '검토중': '<span class="status-badge status-pending">검토중</span>',
    '마케팅팀 승인완료': '<span class="status-badge" style="background:#e3f2fd;color:#1565c0;">마케팅팀승인</span>',
    '디자인팀 승인완료': '<span class="status-badge" style="background:#f3e5f5;color:#6a1b9a;">디자인팀승인</span>',
    'HSAD 확인완료': '<span class="status-badge status-done">HSAD확인완료</span>',
    '발주완료': '<span class="status-badge status-done">발주완료</span>',
    '취소됨': '<span class="status-badge" style="background:#fce4ec;color:#c62828;">취소됨</span>'
};

function renderFixtureRequestTable() {
    const tbody = document.getElementById('fixtureReqTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    fixtureRequestMockData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => {
            // Row click: Navigate to Detail page
            openFixtureDetailPage(idx);
        };
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${item.type}</td>
            <td>${item.prodGroup || '-'}</td>
            <td style="text-align:left; font-weight:500;">${item.fixtureName}</td>
            <td>${item.qty}</td>
            <td>${item.store}</td>
            <td>${item.date}</td>
            <td>${item.completeDate || '-'}</td>
            <td>${statusBadgeMap[item.status] || item.status}</td>
            <td><button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); toggleAccordion(${idx})">상세 ▼</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFixtureRequestCards() {
    const cardWrap = document.getElementById('fixtureCardWrap');
    if (!cardWrap) return;
    cardWrap.innerHTML = '';

    fixtureRequestMockData.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'fixture-card';
        card.onclick = () => openFixtureDetailPage(idx);
        card.innerHTML = `
            <div class="card-top">
                <div>
                    <div class="card-title">${item.fixtureName}</div>
                    <div class="card-subtitle">${item.type} | ${item.prodGroup || '-'}</div>
                </div>
                <div class="card-badge">${statusBadgeMap[item.status] || item.status}</div>
            </div>
            <div class="card-info-grid">
                <div class="card-info-item"><span class="label">수량</span><span class="val">${item.qty}</span></div>
                <div class="card-info-item"><span class="label">매장명</span><span class="val">${item.store}</span></div>
                <div class="card-info-item"><span class="label">접수일자</span><span class="val">${item.date}</span></div>
                <div class="card-info-item"><span class="label">완료일자</span><span class="val">${item.completeDate || '-'}</span></div>
            </div>
            <div class="card-actions">
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); toggleAccordion(${idx})">상세 ▼</button>
            </div>
        `;
        cardWrap.appendChild(card);
    });
}

function toggleAccordion(idx) {
    const item = fixtureRequestMockData[idx];
    document.getElementById('fixtureReqDetail').style.display = 'block';
    document.getElementById('accordionFixDetailTitle').innerText = `${item.id} (기본 정보)`;

    const infoGrid = document.getElementById('accordionDetailInfoGrid');
    infoGrid.innerHTML = `
        <div class="approval-info-item"><span class="info-label">요청 번호</span><span class="info-val">${item.id}</span></div>
        <div class="approval-info-item"><span class="info-label">집기명</span><span class="info-val">${item.fixtureName}</span></div>
        <div class="approval-info-item"><span class="info-label">유형</span><span class="info-val">${item.type}</span></div>
        <div class="approval-info-item"><span class="info-label">제품군</span><span class="info-val">${item.prodGroup || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">수량</span><span class="info-val">${item.qty}</span></div>
        <div class="approval-info-item"><span class="info-label">매장명</span><span class="info-val">${item.store}</span></div>
        <div class="approval-info-item"><span class="info-label">접수일</span><span class="info-val">${item.date}</span></div>
        <div class="approval-info-item"><span class="info-label">완료일</span><span class="info-val">${item.completeDate || '-'}</span></div>
    `;

    document.getElementById('accordionDetailImg').style.display = 'none';
    document.getElementById('accordionDetailImgPlaceholder').style.display = 'block';

    document.getElementById('fixtureReqDetail').scrollIntoView({ behavior: 'smooth' });
}

function openFixtureDetailPage(idx) {
    currentFixtureReqIndex = idx;
    const item = fixtureRequestMockData[idx];

    app.switchView('fixtureReqDetailPage');

    document.getElementById('fixDetailTitle').innerText = `집기 요청 상세 — ${item.id}`;

    // Basic info grid
    const infoGrid = document.getElementById('fixDetailInfoGrid');
    infoGrid.innerHTML = `
        <div class="approval-info-item"><span class="info-label">요청 번호</span><span class="info-val">${item.id}</span></div>
        <div class="approval-info-item"><span class="info-label">집기명</span><span class="info-val">${item.fixtureName}</span></div>
        <div class="approval-info-item"><span class="info-label">유형</span><span class="info-val">${item.type}</span></div>
        <div class="approval-info-item"><span class="info-label">제품군</span><span class="info-val">${item.prodGroup || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">수량</span><span class="info-val">${item.qty}</span></div>
        <div class="approval-info-item"><span class="info-label">매장명</span><span class="info-val">${item.store}</span></div>
        <div class="approval-info-item"><span class="info-label">접수일</span><span class="info-val">${item.date}</span></div>
        <div class="approval-info-item"><span class="info-label">완료일</span><span class="info-val">${item.completeDate || '-'}</span></div>
    `;

    // Mock Image display for full page
    const placeholderEl = document.getElementById('detailFixtureImgPlaceholder');
    if (placeholderEl) {
        placeholderEl.innerText = `[${item.fixtureName}] 이미지`;
    }

    // Render approval stepper based on current step
    resetApprovalStepper();

    // Hide marketing step for VMD types
    const marketingStep = document.getElementById('step-marketing');
    const marketingArrow = marketingStep.nextElementSibling;
    if (item.type === 'VMD 집기') {
        marketingStep.classList.add('apv-step-hidden');
        if (marketingArrow) marketingArrow.classList.add('apv-step-hidden');
        // If it's VMD and step was 0 (검토중), and we skip marketing, it effectively starts from design.
        // But let's keep the logic simple: if step is 0, highlight 'design' if VMD.
    } else {
        marketingStep.classList.remove('apv-step-hidden');
        if (marketingArrow) marketingArrow.classList.remove('apv-step-hidden');
    }

    const step = item.approvalStep;
    if (step === -1) {
        // Cancelled
        ['marketing', 'design', 'hsad', 'complete'].forEach(s => {
            document.getElementById(`step-${s}`).classList.add('apv-step-disabled');
            const btn = document.getElementById(`btn-${s}`);
            if (btn) btn.disabled = true;
        });
        return;
    }

    const stepOrder = ['marketing', 'design', 'hsad'];
    stepOrder.forEach((s, i) => {
        const stepEl = document.getElementById(`step-${s}`);
        const btnEl = document.getElementById(`btn-${s}`);
        const doneEl = document.getElementById(`done-${s}`);
        stepEl.classList.remove('apv-step-disabled', 'apv-step-active', 'apv-step-done');

        // Logic for VMD skipping marketing step
        let effectiveStep = step;
        let currentStepIdx = i;
        if (item.type === 'VMD 집기' && i >= 1) {
            // If VMD, we only care about design(1) and hsad(2).
            // But we already hid the marketing(0) UI.
            // Let's adjust the indices for highlighting:
            // marketing=0, design=1, hsad=2.
            // If VMD, step 0 means design is active? Or keep step as is?
            // The user said "remove marketing step". 
            // So for VMD, if status is '검토중' (0), design step (1) should be active.
            if (effectiveStep === 0) effectiveStep = 1;
        }

        if (i < effectiveStep) {
            // Done
            stepEl.classList.add('apv-step-done');
            if (btnEl) { btnEl.style.display = 'none'; }
            if (doneEl) { doneEl.style.display = 'inline-block'; }
        } else if (i === effectiveStep) {
            // Current active step
            stepEl.classList.add('apv-step-active');
            if (btnEl) { btnEl.disabled = false; btnEl.style.display = 'inline-block'; }
            if (doneEl) { doneEl.style.display = 'none'; }
        } else {
            // Future locked
            stepEl.classList.add('apv-step-disabled');
            if (btnEl) { btnEl.disabled = true; btnEl.style.display = 'inline-block'; }
            if (doneEl) { doneEl.style.display = 'none'; }
        }
    });

    // Complete step
    const completeStep = document.getElementById('step-complete');
    const doneBadgeComplete = document.getElementById('done-complete');
    completeStep.classList.remove('apv-step-disabled', 'apv-step-done');

    let effectiveStepForComplete = step;
    if (item.type === 'VMD 집기' && effectiveStepForComplete === 0) effectiveStepForComplete = 1;

    if (effectiveStepForComplete >= 3) {
        completeStep.classList.add('apv-step-done');
        doneBadgeComplete.style.display = 'inline-block';
    } else {
        completeStep.classList.add('apv-step-disabled');
        doneBadgeComplete.style.display = 'none';
    }
}

function closeFixtureDetail() {
    document.getElementById('fixtureReqDetail').style.display = 'none';
}

function resetApprovalStepper() {
    ['marketing', 'design', 'hsad', 'complete'].forEach(s => {
        const el = document.getElementById(`step-${s}`);
        el.classList.remove('apv-step-active', 'apv-step-done');
        el.classList.add('apv-step-disabled');
        const btn = document.getElementById(`btn-${s}`);
        if (btn) { btn.disabled = true; btn.style.display = 'inline-block'; }
        const done = document.getElementById(`done-${s}`);
        if (done) done.style.display = 'none';
    });
}

function approveStep(step) {
    if (currentFixtureReqIndex === null) return;
    const item = fixtureRequestMockData[currentFixtureReqIndex];
    const stepMap = { marketing: 1, design: 2, hsad: 3 };
    item.approvalStep = stepMap[step];

    const statusMapByStep = {
        1: '마케팅팀 승인완료',
        2: '디자인팀 승인완료',
        3: 'HSAD 확인완료'
    };
    item.status = statusMapByStep[stepMap[step]];

    // Add history row
    const tbody = document.getElementById('approvalHistoryBody');
    const now = new Date();
    const timeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const stepLabel = { marketing: '마케팅팀 승인', design: '디자인팀 승인', hsad: 'HSAD 확인' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${timeStr}</td>
        <td>jhsophy@hsad.co.kr</td>
        <td>${stepLabel[step]}</td>
        <td style="text-align:left;">${stepLabel[step]} 완료 처리</td>
    `;
    tbody.appendChild(tr);

    if (step === 'hsad') {
        const vendorName = arguments.length > 1 ? arguments[1] : '';
        if (vendorName) {
            alert(`[발주 완료]\n선택하신 '${vendorName}' 업체로 발주 요청 메일이 전송되었습니다.`);
        } else {
            alert(`[HSAD 확인 완료]\n발주 요청 메일이 자동 발송되었습니다.`);
        }

        // Update Order Information UI
        const orderDateEl = document.getElementById('orderDateInput');
        const vendorInputEl = document.getElementById('vendorInput');
        if (orderDateEl) orderDateEl.value = timeStr;
        if (vendorInputEl && vendorName) vendorInputEl.value = vendorName;

        // Update Timeline Step
        const steps = document.querySelectorAll('#orderStatusSteps .step');
        if (steps.length >= 2) {
            steps[0].classList.add('completed');
            steps[1].classList.add('active'); // 제작 중
        }

        item.approvalStep = 4;
        item.status = '발주완료';
    }

    app.setFixtureViewMode(currentFixtureViewMode);
    openFixtureDetailPage(currentFixtureReqIndex);
}

function cancelFixtureRequest() {
    if (currentFixtureReqIndex === null) return;
    if (!confirm('요청을 강제 취소하시겠습니까?')) return;
    const item = fixtureRequestMockData[currentFixtureReqIndex];
    item.approvalStep = -1;
    item.status = '취소됨';
    app.setFixtureViewMode(currentFixtureViewMode);
    openFixtureDetailPage(currentFixtureReqIndex);
    alert(`[취소 완료]\n요청 ${item.id}이 강제 취소되었습니다.`);
}

function closeFixtureDetail() {
    document.getElementById('fixtureReqDetail').style.display = 'none';
    currentFixtureReqIndex = null;
}

// ============================================================
// Fixture Status Management
// ============================================================
const fixtureStatusMockData = [
    {
        id: 1, type: '마케팅 집기', prodGroup: 'TV/오디오', code: 'tv00000', name: '집기명1', vendor: '블루오션디자인', status: '조성완료',
        store: '이마트 경기광주점', introDate: '2026.03.05', modDate: '-'
    },
    {
        id: 2, type: 'VMD 집기', prodGroup: '키즈존', code: 'kids00000', name: '집기명2', vendor: '이옛와이', status: '요청 처리중',
        store: '홈플러스 전주완산점', introDate: '2026.03.04', modDate: '-'
    },
    {
        id: 3, type: '마케팅 집기', prodGroup: '주방가전', code: 'Ref00000', name: '집기명3', vendor: '소노코리아', status: '조성완료',
        store: '이마트 수원점', introDate: '2026.02.28', modDate: '-'
    },
    {
        id: 4, type: 'VMD 집기', prodGroup: '연출 집기_캠핑', code: 'camp00000', name: '집기명4', vendor: '인투브이', status: '폐기완료',
        store: '백화점 센텀시티점', introDate: '2026.02.20', modDate: '2026.03.01'
    }
];

// Extend statusBadgeMap for Fixture Status Management
Object.assign(statusBadgeMap, {
    '조성완료': '<span class="status-badge status-done">조성완료</span>',
    '요청 처리중': '<span class="status-badge status-pending">요청 처리중</span>',
    '폐기완료': '<span class="status-badge" style="background:#fce4ec;color:#c62828;">폐기완료</span>',
    '디자인팀승인': '<span class="status-badge" style="background:#e8eaf6;color:#3f51b5;">디자인팀승인</span>',
    '마케팅팀승인': '<span class="status-badge" style="background:#e3f2fd;color:#1976d2;">마케팅팀승인</span>',
    '철거완료': '<span class="status-badge" style="background:#fff3e0;color:#ef6c00;">철거완료</span>',
    '보관완료': '<span class="status-badge" style="background:#fff3e0;color:#ef6c00;">보관완료</span>'
});

let currentFixtureStatusIndex = null;

function renderFixtureStatusTable() {
    const tbody = document.getElementById('fixtureStatusTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    document.getElementById('fixtureStatusTotalCount').innerText = fixtureStatusMockData.length;

    fixtureStatusMockData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => openFixtureStatusFullDetailPage(idx);
        tr.innerHTML = `
            <td><input type="checkbox" onclick="event.stopPropagation()"></td>
            <td>${idx + 1}</td>
            <td>${item.type}</td>
            <td>${item.prodGroup}</td>
            <td>${item.code}</td>
            <td style="text-align:left; font-weight:500;">${item.name}</td>
            <td>${item.vendor}</td>
            <td>${statusBadgeMap[item.status] || item.status}</td>
            <td><button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); toggleFixtureStatusAccordion(${idx})">상세 ▼</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleFixtureStatusAccordion(idx) {
    const item = fixtureStatusMockData[idx];
    const detailPanel = document.getElementById('fixtureStatusDetail');

    if (currentFixtureStatusIndex === idx && detailPanel.style.display === 'block') {
        detailPanel.style.display = 'none';
        currentFixtureStatusIndex = null;
        return;
    }

    currentFixtureStatusIndex = idx;
    detailPanel.style.display = 'block';

    // Update Header
    document.getElementById('accordionFixStatusDetailTitle').innerText = `${item.code} | ${item.name}`;
    document.getElementById('accordionFixStatusDetailBadge').innerHTML = statusBadgeMap[item.status] || item.status;

    // Populate Info Grid
    const infoGrid = document.getElementById('fixtureStatusAccordionInfoGrid');
    infoGrid.innerHTML = `
        <div class="approval-info-item"><span class="info-label">집기 코드</span><span class="info-val" style="font-weight:600;">${item.code}</span></div>
        <div class="approval-info-item"><span class="info-label">집기명</span><span class="info-val" style="font-weight:600;">${item.name}</span></div>
        <div class="approval-info-item"><span class="info-label">유형</span><span class="info-val">${item.type}</span></div>
        <div class="approval-info-item"><span class="info-label">제품군</span><span class="info-val">${item.prodGroup}</span></div>
        <div class="approval-info-item"><span class="info-label">협력사</span><span class="info-val">${item.vendor}</span></div>
        <div class="approval-info-item"><span class="info-label">집기 위치(매장)</span><span class="info-val">${item.store || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">최초 도입일</span><span class="info-val">${item.introDate || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">최근 변동일</span><span class="info-val">${item.modDate || '-'}</span></div>
    `;

    detailPanel.scrollIntoView({ behavior: 'smooth' });
}

function closeFixtureStatusDetail() {
    document.getElementById('fixtureStatusDetail').style.display = 'none';
    currentFixtureStatusIndex = null;
}

function openFixtureStatusFullDetailPage(idx) {
    currentFixtureStatusIndex = idx;
    const item = fixtureStatusMockData[idx];
    app.switchView('fixtureStatusDetailPage');

    // Update Header
    document.getElementById('fixStatusDetailFullTitle').innerText = `${item.code} | ${item.name}`;
    document.getElementById('fixStatusDetailFullBadge').innerHTML = statusBadgeMap[item.status] || item.status;

    // Populate Info Grid
    const infoGrid = document.getElementById('fixStatusDetailFullInfoGrid');
    infoGrid.innerHTML = `
        <div class="approval-info-item"><span class="info-label">집기 코드</span><span class="info-val" style="font-weight:600;">${item.code}</span></div>
        <div class="approval-info-item"><span class="info-label">집기명</span><span class="info-val" style="font-weight:600;">${item.name}</span></div>
        <div class="approval-info-item"><span class="info-label">유형</span><span class="info-val">${item.type}</span></div>
        <div class="approval-info-item"><span class="info-label">제품군</span><span class="info-val">${item.prodGroup}</span></div>
        <div class="approval-info-item"><span class="info-label">협력사</span><span class="info-val">${item.vendor}</span></div>
        <div class="approval-info-item"><span class="info-label">집기 위치(매장)</span><span class="info-val">${item.store || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">최초 도입일</span><span class="info-val">${item.introDate || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">최근 변동일</span><span class="info-val">${item.modDate || '-'}</span></div>
    `;

    // Populate History Table (Comprehensive Demo Data)
    const historyTbody = document.getElementById('fixStatusHistoryTableBody');

    // Base history for all items
    let dummyHistory = [
        { date: '2026.02.10', type: '요청', status: '검토중', note: '신규 집기 도입 요청', user: '홍길동 (hong@lge.com)' },
        { date: '2026.02.12', type: '승인', status: '디자인팀승인', note: '디자인 및 수량 검토 완료', user: '김디자인 (kim.design@lge.com)' },
        { date: '2026.02.13', type: '승인', status: '마케팅팀승인', note: '최종 도입 승인 완료', user: '정마케팅 (jung@lge.com)' },
        { date: '2026.02.15', type: '발주', status: '발주완료', note: 'HSAD 제작 발주 완료', user: '박관리 (park.admin@hsad.co.kr)' },
        { date: item.introDate || '2026.03.01', type: '설치(조성)', status: '조성완료', note: '매장 설치 및 검수 완료', user: '최설치 (choi@vendor.com)' }
    ];

    // Add additional history based on item status or for demo purposes
    if (item.id === 1) { // tv00000 - 조성완료
        dummyHistory.push({ date: '2026.03.04', type: 'A/S', status: '조성완료', note: '화면 출력 이상 점검 및 케이블 교체', user: '이AS (lee@hsad.co.kr)' });
    } else if (item.id === 2) { // kids00000 - 요청 처리중
        dummyHistory = dummyHistory.slice(0, 4); // Still in progress (up to 발주완료)
        dummyHistory.push({ date: '2026.03.05', type: '보류', status: '요청 처리중', note: '매장 리뉴얼 일정으로 인한 설치 보류', user: '정마케팅 (jung@lge.com)' });
    } else if (item.id === 4) { // camp00000 - 폐기완료
        dummyHistory.push({ date: '2026.03.05', type: '철거', status: '철거완료', note: '시즌 종료로 인한 철거', user: '박HSAD (park@hsad.co.kr)' });
        dummyHistory.push({ date: '2026.03.06', type: '보관', status: '보관완료', note: '물류 창고 입고 및 보관', user: '김HSAD (kim@hsad.co.kr)' });
        dummyHistory.push({ date: item.modDate || '2026.03.08', type: '폐기', status: '폐기완료', note: '파손으로 인한 최종 폐기 처리', user: '김HSAD (kim@hsad.co.kr)' });
    }

    historyTbody.innerHTML = dummyHistory.map((h, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${h.date}</td>
            <td>${h.type}</td>
            <td>${statusBadgeMap[h.status] || h.status}</td>
            <td style="text-align:left;">${h.note}</td>
            <td>${h.user}</td>
        </tr>
    `).reverse().join('');
}



// Vendor modal for HSAD step
function openHsadVendorModal() {
    document.getElementById('hsadVendorModal').style.display = 'flex';
}

function closeHsadVendorModal() {
    document.getElementById('hsadVendorModal').style.display = 'none';
}

function confirmHsadVendorOrder() {
    const vendor = document.getElementById('hsadVendorSelect').value;
    if (!vendor || vendor.trim() === "") {
        alert('제작 업체를 선택해주세요.');
        return;
    }
    closeHsadVendorModal();
    approveStep('hsad', vendor);
}
