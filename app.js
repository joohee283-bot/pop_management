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
            'fixtureStatusDetailPage': 'fixtureStatusDetailPageView',
            'fixtureManagement': 'fixtureManagementView'
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
        } else if (viewId === 'fixtureManagement') {
            const parent = document.getElementById('parent-fixture-master');
            if (parent) {
                parent.classList.add('active');
                parent.classList.add('open');
            }
            const sub = document.getElementById('sub-fixtureManagement');
            if (sub) sub.classList.add('active-sub');

            if (!fixtureMasterData) {
                app.initFixtureMgmt();
            }
            app.setMgmtInitial('marketing');
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

window.app = app;

// --- Initialization ---
console.log("app.js: Local script loaded and app object exposed to window.");
document.addEventListener('DOMContentLoaded', () => {
    console.log("app.js: DOMContentLoaded fired.");
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
        approvalStep: 3,
        vendor: '위즈네트웍스',
        owningTeam: 'B2B마케팅팀',
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
        approvalStep: -1,
        vendor: '인투브이',
        owningTeam: 'VMD기획팀',
        remarks: '캠핑존 전면 배치 희망합니다.',
        fixtureImage: 'https://via.placeholder.com/350x350?text=Fixture+Image',
        positionImage: 'https://via.placeholder.com/350x350?text=Position+Image'
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
        <div class="approval-info-item"><span class="info-label">협력사</span><span class="info-val">${item.vendor || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">주체 팀</span><span class="info-val">${item.owningTeam || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">접수일</span><span class="info-val">${item.date}</span></div>
        <div class="approval-info-item"><span class="info-label">완료일</span><span class="info-val">${item.completeDate || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">희망 설치일</span><span class="info-val">${item.installDate || '-'}</span></div>
        <div class="approval-info-item" style="grid-column: span 2;"><span class="info-label">기타 특이사항</span><span class="info-val">${item.remarks || '-'}</span></div>
    `;

    const imgEl = document.getElementById('accordionDetailImg');
    const phEl = document.getElementById('accordionDetailImgPlaceholder');
    const posImgEl = document.getElementById('accordionPosImg');
    const posPhEl = document.getElementById('accordionPosImgPlaceholder');

    // Fixture image
    if (item.fixtureImage) {
        imgEl.src = item.fixtureImage;
        imgEl.style.display = 'block';
        phEl.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        phEl.style.display = 'block';
        phEl.innerText = `[${item.fixtureName}] 집기 이미지`;
    }

    // Position image
    if (item.positionImage) {
        posImgEl.src = item.positionImage;
        posImgEl.style.display = 'block';
        posPhEl.style.display = 'none';
    } else {
        posImgEl.style.display = 'none';
        posPhEl.style.display = 'block';
        posPhEl.innerText = `[${item.fixtureName}] 연출 위치 이미지`;
    }

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
        <div class="approval-info-item"><span class="info-label">협력사</span><span class="info-val">${item.vendor || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">주체 팀</span><span class="info-val">${item.owningTeam || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">접수일</span><span class="info-val">${item.date}</span></div>
        <div class="approval-info-item"><span class="info-label">완료일</span><span class="info-val">${item.completeDate || '-'}</span></div>
        <div class="approval-info-item"><span class="info-label">희망 설치일</span><span class="info-val">${item.installDate || '-'}</span></div>
        <div class="approval-info-item" style="grid-column: span 2;"><span class="info-label">기타 특이사항</span><span class="info-val">${item.remarks || '-'}</span></div>
    `;

    // Mock Image display for full page
    const detailImgEl = document.getElementById('detailFixtureImg');
    const placeholderEl = document.getElementById('detailFixtureImgPlaceholder');
    const detailPosImgEl = document.getElementById('detailPosImg');
    const posPlaceholderEl = document.getElementById('detailPosImgPlaceholder');

    // Fixture image
    if (item.fixtureImage) {
        detailImgEl.src = item.fixtureImage;
        detailImgEl.style.display = 'block';
        if (placeholderEl) placeholderEl.style.display = 'none';
    } else {
        detailImgEl.style.display = 'none';
        if (placeholderEl) {
            placeholderEl.style.display = 'block';
            placeholderEl.innerText = `[${item.fixtureName}] 집기 이미지`;
        }
    }

    // Position image
    if (item.positionImage) {
        detailPosImgEl.src = item.positionImage;
        detailPosImgEl.style.display = 'block';
        if (posPlaceholderEl) posPlaceholderEl.style.display = 'none';
    } else {
        detailPosImgEl.style.display = 'none';
        if (posPlaceholderEl) {
            posPlaceholderEl.style.display = 'block';
            posPlaceholderEl.innerText = `[${item.fixtureName}] 연출 위치 이미지`;
        }
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
        const cancelBtnEl = document.getElementById(`btn-${s}-cancel`);
        const doneEl = document.getElementById(`done-${s}`);
        stepEl.classList.remove('apv-step-disabled', 'apv-step-active', 'apv-step-done');

        // Logic for VMD skipping marketing step
        let effectiveStep = step;
        let currentStepIdx = i;
        if (item.type === 'VMD 집기' && i >= 1) {
            if (effectiveStep === 0) effectiveStep = 1;
        }

        if (i < effectiveStep) {
            // Done
            stepEl.classList.add('apv-step-done');
            if (btnEl) { btnEl.style.display = 'none'; }
            if (doneEl) { doneEl.style.display = 'inline-block'; }
            if (cancelBtnEl && (s === 'marketing' || s === 'design')) {
                // If the next step is already completed, maybe prevent cancel?
                // But let's allow it as long as the overall request is not completed (step=4)
                if (step < 4) {
                    cancelBtnEl.style.display = 'inline-block';
                } else {
                    cancelBtnEl.style.display = 'none';
                }
            }
        } else if (i === effectiveStep) {
            // Current active step
            stepEl.classList.add('apv-step-active');
            if (btnEl) { btnEl.disabled = false; btnEl.style.display = 'inline-block'; }
            if (doneEl) { doneEl.style.display = 'none'; }
            if (cancelBtnEl) { cancelBtnEl.style.display = 'none'; }
        } else {
            // Future locked
            stepEl.classList.add('apv-step-disabled');
            if (btnEl) { btnEl.disabled = true; btnEl.style.display = 'inline-block'; }
            if (doneEl) { doneEl.style.display = 'none'; }
            if (cancelBtnEl) { cancelBtnEl.style.display = 'none'; }
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

        // --- Show Estimate Section if HSAD Approval is Done (>= 3) ---
        const estimateSection = document.getElementById('estimateSection');
        const vmdFields = document.getElementById('vmdEstimateFields');
        const mktFields = document.getElementById('marketingEstimateFields');
        const estimateTypeLabel = document.getElementById('estimateTypeLabel');

        if (estimateSection) {
            estimateSection.style.display = 'block';
            if (item.type === 'VMD 집기') {
                if (estimateTypeLabel) estimateTypeLabel.innerText = 'VMD 집기 비용';
                if (vmdFields) vmdFields.style.display = 'grid';
                if (mktFields) { mktFields.style.display = 'none'; mktFields.innerHTML = ''; }
            } else {
                if (estimateTypeLabel) estimateTypeLabel.innerText = '마케팅 집기 비용';
                if (vmdFields) vmdFields.style.display = 'none';
                if (mktFields) {
                    // Ensure fixture master data is loaded
                    if (!fixtureMasterData) app.initFixtureMgmt();
                    const teams = (fixtureMasterData && fixtureMasterData.marketing)
                        ? fixtureMasterData.marketing
                        : [];
                    // Generate one row per top-level marketing category
                    mktFields.innerHTML = teams.map(cat => `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 140px; font-size: 0.9rem;">(${cat.name}) 마케팅팀 비용</span>
                            <input type="text" class="admin-input" placeholder="0" style="flex: 1; text-align: right; padding: 5px; border: 1px solid #ccc;"> <span style="color:#666;">원</span>
                        </div>
                    `).join('');
                    mktFields.style.display = 'grid';
                }
            }
        }
    } else {
        completeStep.classList.add('apv-step-disabled');
        doneBadgeComplete.style.display = 'none';

        // --- Hide Estimate Section ---
        const estimateSection = document.getElementById('estimateSection');
        if (estimateSection) estimateSection.style.display = 'none';
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
        const cancelBtn = document.getElementById(`btn-${s}-cancel`);
        if (cancelBtn) { cancelBtn.style.display = 'none'; }
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

function cancelApprovalStep(step) {
    if (currentFixtureReqIndex === null) return;
    if (!confirm('승인을 취소하시겠습니까?')) return;

    const item = fixtureRequestMockData[currentFixtureReqIndex];
    if (step === 'marketing') {
        item.approvalStep = 0;
        item.status = '검토중';
    } else if (step === 'design') {
        // If VMD, and marketing was skipped, going back from design means going back to 0 (검토중).
        if (item.type === 'VMD 집기') {
            item.approvalStep = 0;
            item.status = '검토중';
        } else {
            item.approvalStep = 1;
            item.status = '마케팅팀 승인완료';
        }
    }

    // Add history row
    const tbody = document.getElementById('approvalHistoryBody');
    const now = new Date();
    const timeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const stepLabel = { marketing: '마케팅팀 승인 취소', design: '디자인팀 승인 취소' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${timeStr}</td>
        <td>jhsophy@hsad.co.kr</td>
        <td style="color: #c62828;">${stepLabel[step]}</td>
        <td style="text-align:left;">${stepLabel[step]} 처리</td>
    `;
    tbody.appendChild(tr);

    app.setFixtureViewMode(currentFixtureViewMode);
    openFixtureDetailPage(currentFixtureReqIndex);
    alert(`[취소 완료]\n${stepLabel[step]} 되었습니다.`);
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

// ============================================================
// Fixture Master Management Logic
// ============================================================
let fixtureMasterData = null;
let currentMgmtInitial = 'marketing';
let selectedMgmtPath = []; // e.g. ['largeId', 'middleId', 'smallId']
let currentEditingId = null;
let currentEditingType = null; // 'category' or 'fixture'

app.initFixtureMgmt = function () {
    const savedData = localStorage.getItem('fixtureMasterData');
    if (savedData) {
        fixtureMasterData = JSON.parse(savedData);
    } else {
        // Default Mock Data
        fixtureMasterData = {
            marketing: [
                {
                    id: 'L1', name: 'TV/오디오', children: [
                        {
                            id: 'M1', name: '상업용 디스플레이', children: [
                                {
                                    id: 'S1', name: '상업용 디스플레이 65인치', fixtures: [
                                        { id: 'F1', name: '상업용 디스플레이 65인치', size: '1450 x 830', cost: '1,500,000원', img: '' }
                                    ]
                                },
                                {
                                    id: 'S2', name: '상업용 디스플레이 75인치', fixtures: [
                                        { id: 'F2', name: '상업용 디스플레이 75인치', size: '1690 x 960', cost: '2,100,000원', img: '' }
                                    ]
                                }
                            ],
                            fixtures: []
                        },
                        {
                            id: 'M2', name: '프로젝터', children: [], fixtures: [
                                { id: 'F3', name: '시네빔 레이저 4K', size: '400 x 400', cost: '2,000,000원', img: '' }
                            ]
                        },
                        {
                            id: 'M3', name: '스탠바이미', children: [], fixtures: [
                                { id: 'F4', name: '스탠바이미 GO27', size: '270 x 580 x 500', cost: '900,000원', img: '' }
                            ]
                        }
                    ]
                },
                {
                    id: 'L2', name: 'PC/모니터', children: [
                        {
                            id: 'M4', name: '노트북', children: [], fixtures: [
                                { id: 'F5', name: 'LG 그램 16인치', size: '360 x 240', cost: '1,200,000원', img: '' },
                                { id: 'F6', name: 'LG 그램 코더제로 14', size: '390 x 270', cost: '1,100,000원', img: '' }
                            ]
                        },
                        {
                            id: 'M5', name: '울트라 PC', children: [], fixtures: [
                                { id: 'F7', name: 'LG 코드 제로 부스터', size: '1200 x 600 x 1400', cost: '850,000원', img: '' }
                            ]
                        }
                    ]
                },
                {
                    id: 'L3', name: '주방가전', children: [
                        {
                            id: 'M6', name: '닉포트', children: [], fixtures: [
                                { id: 'F8', name: '닉포트 단독 부스', size: '800 x 700 x 1400', cost: '650,000원', img: '' },
                                { id: 'F9', name: '닉포트 코너 유닛', size: '600 x 600 x 1200', cost: '480,000원', img: '' }
                            ]
                        },
                        {
                            id: 'M7', name: '스스 오브제', children: [], fixtures: [
                                { id: 'F10', name: '스스 단독모델 방다', size: '550 x 500 x 1100', cost: '320,000원', img: '' }
                            ]
                        }
                    ]
                }
            ],
            vmd: [
                {
                    id: 'VL1', name: '첨제 스탠드', children: [
                        {
                            id: 'VM1', name: '대형 첨제 스탠드', children: [], fixtures: [
                                { id: 'VF1', name: 'DP 대형 첨제 스탠드 A형', size: '600 x 600 x 1800', cost: '450,000원', img: '' },
                                { id: 'VF2', name: 'DP 대형 첨제 스탠드 B형', size: '600 x 600 x 1600', cost: '380,000원', img: '' }
                            ]
                        },
                        {
                            id: 'VM2', name: '중형 첨제 스탠드', children: [], fixtures: [
                                { id: 'VF3', name: '중형 첨제 스탠드', size: '400 x 400 x 1400', cost: '280,000원', img: '' },
                                { id: 'VF4', name: '인스토어 중형형', size: '450 x 400 x 1300', cost: '260,000원', img: '' }
                            ]
                        },
                        {
                            id: 'VM3', name: '소형 첨제 스탠드', children: [], fixtures: [
                                { id: 'VF5', name: '소형 엑세서리 스탠드', size: '300 x 300 x 1000', cost: '180,000원', img: '' }
                            ]
                        }
                    ]
                },
                {
                    id: 'VL2', name: '팁팁이', children: [
                        {
                            id: 'VM4', name: '도어형 팁팁이', children: [], fixtures: [
                                { id: 'VF6', name: '도어형 팁팁이 대형', size: '1200 x 600 x 2200', cost: '1,200,000원', img: '' }
                            ]
                        },
                        {
                            id: 'VM5', name: '박스형 팁팁이', children: [], fixtures: [
                                { id: 'VF7', name: '박스형 팁팁이 중형', size: '900 x 500 x 500', cost: '580,000원', img: '' }
                            ]
                        }
                    ]
                },
                {
                    id: 'VL3', name: 'VMD 집기 (시안)', children: [
                        {
                            id: 'VM6', name: '첨제 세트', children: [], fixtures: [
                                { id: 'VF8', name: '시안 1 첨제 세트', size: '1200 x 800 x 1600', cost: '3,500,000원', img: '' },
                                { id: 'VF9', name: '시안 2 첨제 세트', size: '1100 x 750 x 1550', cost: '3,100,000원', img: '' },
                                { id: 'VF10', name: '시안 3 첨제 세트', size: '1000 x 700 x 1500', cost: '2,800,000원', img: '' }
                            ]
                        }
                    ]
                }
            ]
        };
        localStorage.setItem('fixtureMasterData', JSON.stringify(fixtureMasterData));
    }
};

app.setMgmtInitial = function (type) {
    currentMgmtInitial = type;
    selectedMgmtPath = [];

    document.getElementById('btn-initial-marketing').className = (type === 'marketing') ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
    document.getElementById('btn-initial-vmd').className = (type === 'vmd') ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';

    app.renderCategoryTree();
    app.renderMgmtContent();
};

app.renderCategoryTree = function () {
    const container = document.getElementById('categoryTreeContainer');
    if (!container) return;

    const data = fixtureMasterData[currentMgmtInitial];
    container.innerHTML = '';

    data.forEach(large => {
        const group = document.createElement('div');
        group.className = 'tree-group';
        const isSelected = selectedMgmtPath[0] === large.id;

        group.innerHTML = `
            <div class="tree-item level-1 ${isSelected ? 'active' : ''}" onclick="app.selectMgmtCategory(['${large.id}'])">
                <i class='bx bx-chevron-right'></i>
                <i class='bx bx-folder'></i>
                ${large.name}
            </div>
            <div class="tree-children" style="display: ${isSelected ? 'block' : 'none'}">
                ${large.children.map(middle => {
            const isMidSelected = isSelected && selectedMgmtPath[1] === middle.id;
            return `
                        <div class="tree-group ${isMidSelected ? 'expanded' : ''}">
                            <div class="tree-item level-2 ${isMidSelected ? 'active' : ''}" onclick="app.selectMgmtCategory(['${large.id}', '${middle.id}'])">
                                <i class='bx bx-chevron-right'></i>
                                <i class='bx bx-folder-open'></i>
                                ${middle.name}
                            </div>
                            <div class="tree-children" style="display: ${isMidSelected ? 'block' : 'none'}">
                                ${middle.children.map(small => {
                const isSmallSelected = isMidSelected && selectedMgmtPath[2] === small.id;
                return `
                                        <div class="tree-item level-3 ${isSmallSelected ? 'active' : ''}" onclick="app.selectMgmtCategory(['${large.id}', '${middle.id}', '${small.id}'])">
                                            <i class='bx bx-subdirectory-right'></i>
                                            ${small.name}
                                        </div>
                                    `;
            }).join('')}
                                <div class="tree-item level-3" style="color: #999; font-size: 0.8rem;" onclick="app.openCategoryModal('small', '${middle.id}')">+ 소카테고리 추가</div>
                            </div>
                        </div>
                    `;
        }).join('')}
                <div class="tree-item level-2" style="color: #999; font-size: 0.8rem;" onclick="app.openCategoryModal('middle', '${large.id}')">+ 중카테고리 추가</div>
            </div>
        `;
        container.appendChild(group);
    });
};

app.selectMgmtCategory = function (path) {
    selectedMgmtPath = path;
    app.renderCategoryTree();
    app.renderMgmtContent();
};

app.renderMgmtContent = function () {
    const breadcrumb = document.getElementById('mgmtBreadcrumb');
    const container = document.getElementById('mgmtListContainer');
    const btnAddFix = document.getElementById('btnAddFixture');
    const btnEditCat = document.getElementById('btnEditCategory');

    if (selectedMgmtPath.length === 0) {
        breadcrumb.innerText = '전체';
        btnAddFix.style.display = 'none';
        btnEditCat.style.display = 'none';
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; color: #999; padding-top: 100px;">
                <i class='bx bx-info-circle' style="font-size: 3rem; display: block; margin-bottom: 10px;"></i>
                <p>좌측 카테고리를 선택하여<br>구성 정보를 확인하거나 집기를 등록해주세요.</p>
            </div>
        `;
        return;
    }

    // Find selected object
    let currentObj = null;
    let names = [currentMgmtInitial === 'marketing' ? '마케팅 집기' : 'VMD 집기'];

    const large = fixtureMasterData[currentMgmtInitial].find(l => l.id === selectedMgmtPath[0]);
    names.push(large.name);
    currentObj = large;

    if (selectedMgmtPath.length >= 2) {
        const middle = large.children.find(m => m.id === selectedMgmtPath[1]);
        names.push(middle.name);
        currentObj = middle;
    }

    if (selectedMgmtPath.length >= 3) {
        const small = currentObj.children.find(s => s.id === selectedMgmtPath[2]);
        names.push(small.name);
        currentObj = small;
    }

    breadcrumb.innerText = names.join(' > ');
    btnEditCat.style.display = 'inline-block';

    // Only Middle or Small can have fixtures in this demo (or all levels if needed)
    // The user said: 4. 소카테고리 항목이 없고 바로 5. 집기 상세로 넘어가는 케이스도 있어
    // So both Middle and Small should show "Add Fixture" button if they are "leaf" categories or intended to have fixtures.
    btnAddFix.style.display = 'inline-block';

    const fixtures = currentObj.fixtures || [];

    if (fixtures.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 50px; background: #fafafa; border-radius: 8px;">
                <p style="color: #999; margin-bottom: 15px;">등록된 집기가 없습니다.</p>
                <button class="btn btn-primary" onclick="app.openFixtureModal()">+ 첫 번째 집기 등록</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="mgmt-fixture-grid">
                ${fixtures.map(f => `
                    <div class="mgmt-fixture-card">
                        <div class="mgmt-fixture-img">
                            ${f.img ? `<img src="${f.img}">` : '<i class="bx bx-image" style="font-size: 2rem; color: #ddd;"></i>'}
                        </div>
                        <div class="mgmt-fixture-info">
                            <div class="mgmt-fixture-name">${f.name}</div>
                            <div class="mgmt-fixture-meta">사이즈: ${f.size || '-'}</div>
                            <div class="mgmt-fixture-meta">견적: ${f.cost || '-'}</div>
                            <div class="mgmt-fixture-meta" style="color: #A50034; font-weight: 500;">담당 팀: ${f.team || '-'}</div>
                            <div style="margin-top: 10px; display: flex; gap: 5px;">
                                <button class="btn btn-outline btn-sm" style="flex:1; font-size: 0.75rem;" onclick="app.openFixtureModal('${f.id}')">수정</button>
                                <button class="btn btn-outline btn-sm" style="flex:1; font-size: 0.75rem; color: #A50034;" onclick="app.deleteFixture('${f.id}')">삭제</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

app.openCategoryModal = function (type, parentId = null) {
    currentEditingType = 'category';
    currentEditingId = parentId; // For new category, parentId is stored here

    const title = document.getElementById('categoryModalTitle');
    const input = document.getElementById('categoryNameInput');
    input.value = '';

    if (type === 'edit') {
        title.innerText = '카테고리명 수정';
        // Find existing name
        let name = '';
        const data = fixtureMasterData[currentMgmtInitial];
        if (selectedMgmtPath.length === 1) name = data.find(l => l.id === selectedMgmtPath[0]).name;
        else if (selectedMgmtPath.length === 2) name = data.find(l => l.id === selectedMgmtPath[0]).children.find(m => m.id === selectedMgmtPath[1]).name;
        else if (selectedMgmtPath.length === 3) name = data.find(l => l.id === selectedMgmtPath[0]).children.find(m => m.id === selectedMgmtPath[1]).children.find(s => s.id === selectedMgmtPath[2]).name;
        input.value = name;
        currentEditingId = 'EDIT_CURRENT';
    } else {
        title.innerText = (type === 'large' ? '대카테고리' : type === 'middle' ? '중카테고리' : '소카테고리') + ' 등록';
        currentEditingType = 'category_new_' + type;
    }

    document.getElementById('categoryModal').style.display = 'flex';
};

app.closeCategoryModal = function () {
    document.getElementById('categoryModal').style.display = 'none';
};

app.saveCategory = function () {
    const name = document.getElementById('categoryNameInput').value;
    if (!name.trim()) return alert('카테고리명을 입력해주세요.');

    const data = fixtureMasterData[currentMgmtInitial];
    const newId = 'ID_' + Date.now();

    if (currentEditingType === 'category_new_large') {
        data.push({ id: newId, name: name, children: [], fixtures: [] });
    } else if (currentEditingType === 'category_new_middle') {
        const large = data.find(l => l.id === currentEditingId);
        large.children.push({ id: newId, name: name, children: [], fixtures: [] });
    } else if (currentEditingType === 'category_new_small') {
        const large = data.find(l => l.id === selectedMgmtPath[0]);
        const middle = large.children.find(m => m.id === currentEditingId);
        middle.children.push({ id: newId, name: name, fixtures: [] });
    } else if (currentEditingId === 'EDIT_CURRENT') {
        if (selectedMgmtPath.length === 1) data.find(l => l.id === selectedMgmtPath[0]).name = name;
        else if (selectedMgmtPath.length === 2) data.find(l => l.id === selectedMgmtPath[0]).children.find(m => m.id === selectedMgmtPath[1]).name = name;
        else if (selectedMgmtPath.length === 3) data.find(l => l.id === selectedMgmtPath[0]).children.find(m => m.id === selectedMgmtPath[1]).children.find(s => s.id === selectedMgmtPath[2]).name = name;
    }

    localStorage.setItem('fixtureMasterData', JSON.stringify(fixtureMasterData));
    app.renderCategoryTree();
    app.renderMgmtContent();
    app.closeCategoryModal();
};

app.openFixtureModal = function (fixtureId = null) {
    currentEditingType = 'fixture';
    currentEditingId = fixtureId;

    const title = document.getElementById('fixtureModalTitle');
    const nameIn = document.getElementById('fixNameInput');
    const sizeIn = document.getElementById('fixSizeInput');
    const costIn = document.getElementById('fixCostInput');
    const teamIn = document.getElementById('fixTeamInput');

    nameIn.value = '';
    sizeIn.value = '';
    costIn.value = '';
    if (teamIn) teamIn.value = '';

    if (fixtureId) {
        title.innerText = '집기 정보 수정';
        // Find fixture
        const large = fixtureMasterData[currentMgmtInitial].find(l => l.id === selectedMgmtPath[0]);
        let parent = large;
        if (selectedMgmtPath.length >= 2) parent = large.children.find(m => m.id === selectedMgmtPath[1]);
        if (selectedMgmtPath.length >= 3) parent = parent.children.find(s => s.id === selectedMgmtPath[2]);

        const fix = parent.fixtures.find(f => f.id === fixtureId);
        nameIn.value = fix.name;
        sizeIn.value = fix.size;
        costIn.value = fix.cost;
        if (teamIn) teamIn.value = fix.team || '';
    } else {
        title.innerText = '집기 정보 등록';
    }

    document.getElementById('fixtureModal').style.display = 'flex';
};

app.closeFixtureModal = function () {
    document.getElementById('fixtureModal').style.display = 'none';
};

app.saveFixture = function () {
    const name = document.getElementById('fixNameInput').value;
    const size = document.getElementById('fixSizeInput').value;
    const cost = document.getElementById('fixCostInput').value;
    const teamEl = document.getElementById('fixTeamInput');
    const team = teamEl ? teamEl.value : '';

    if (!name.trim()) return alert('집기명을 입력해주세요.');

    const large = fixtureMasterData[currentMgmtInitial].find(l => l.id === selectedMgmtPath[0]);
    let parent = large;
    if (selectedMgmtPath.length >= 2) parent = large.children.find(m => m.id === selectedMgmtPath[1]);
    if (selectedMgmtPath.length >= 3) parent = parent.children.find(s => s.id === selectedMgmtPath[2]);

    if (currentEditingId) {
        const fix = parent.fixtures.find(f => f.id === currentEditingId);
        fix.name = name;
        fix.size = size;
        fix.cost = cost;
        fix.team = team;
    } else {
        const newId = 'FIX_' + Date.now();
        parent.fixtures.push({ id: newId, name: name, size: size, cost: cost, team: team, img: '' });
    }

    localStorage.setItem('fixtureMasterData', JSON.stringify(fixtureMasterData));
    app.renderMgmtContent();
    app.closeFixtureModal();
};

app.deleteFixture = function (id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const large = fixtureMasterData[currentMgmtInitial].find(l => l.id === selectedMgmtPath[0]);
    let parent = large;
    if (selectedMgmtPath.length >= 2) parent = large.children.find(m => m.id === selectedMgmtPath[1]);
    if (selectedMgmtPath.length >= 3) parent = parent.children.find(s => s.id === selectedMgmtPath[2]);

    parent.fixtures = parent.fixtures.filter(f => f.id !== id);

    localStorage.setItem('fixtureMasterData', JSON.stringify(fixtureMasterData));
    app.renderMgmtContent();
};

function toggleApprovalHistory() {
    const wrap = document.getElementById('approvalHistoryTableWrap');
    const icon = document.querySelector('#btnToggleApprovalHistory i');
    if (!wrap || !icon) return;

}

// ==========================================
// Monthly Amount Check Modal Logic
// ==========================================

app.currentMonthlyType = 'marketing'; // 'marketing' | 'vmd'

app.openMonthlyAmountModal = function () {
    // Ensure fixture master data is loaded before opening
    if (!fixtureMasterData) {
        app.initFixtureMgmt();
    }
    document.getElementById('monthlyAmountModal').style.display = 'flex';
    app.switchMonthlyType('marketing');
};

app.closeMonthlyAmountModal = function () {
    document.getElementById('monthlyAmountModal').style.display = 'none';
};

app.switchMonthlyType = function (type) {
    app.currentMonthlyType = type;

    // Update Tab Styles
    const mktTab = document.getElementById('monthlyTabMarketing');
    const vmdTab = document.getElementById('monthlyTabVmd');

    if (type === 'marketing') {
        mktTab.style.borderBottomColor = '#A50034';
        mktTab.style.color = '#A50034';
        vmdTab.style.borderBottomColor = 'transparent';
        vmdTab.style.color = '#666';

        document.getElementById('labelMonthlySubGroup').innerText = '팀별';
    } else {
        vmdTab.style.borderBottomColor = '#A50034';
        vmdTab.style.color = '#A50034';
        mktTab.style.borderBottomColor = 'transparent';
        mktTab.style.color = '#666';

        document.getElementById('labelMonthlySubGroup').innerText = '채널별';
    }

    // Always default to 'item' (집기별) when switching primary tab
    document.getElementById('monthlySubTypeItem').checked = true;

    app.renderMonthlyAmount();
};

app.renderMonthlyAmount = function () {
    const wrap = document.getElementById('monthlyAmountResultWrap');
    if (!wrap) return;

    const subType = document.querySelector('input[name="monthlySubType"]:checked').value;

    let html = '';

    if (subType === 'item') {
        // 집기별 (Grid/Card) - fully recursive traversal
        function collectFixtures(node) {
            let result = [];
            if (node.fixtures && node.fixtures.length > 0) {
                result = result.concat(node.fixtures);
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    result = result.concat(collectFixtures(child));
                });
            }
            return result;
        }

        let allFixtures = [];
        if (fixtureMasterData && fixtureMasterData[app.currentMonthlyType]) {
            fixtureMasterData[app.currentMonthlyType].forEach(large => {
                allFixtures = allFixtures.concat(collectFixtures(large));
            });
        }

        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">`;
        if (allFixtures.length === 0) {
            html += `<div style="grid-column: 1 / -1; text-align: center; color: #999; padding: 40px;">등록된 집기가 없습니다.</div>`;
        } else {
            allFixtures.forEach(f => {
                // Generate a dummy accumulated amount based on id for consistency
                let numId = f.id.replace(/\D/g, '') || '1';
                let accCost = (parseInt(numId) % 10 + 1) * 150000;

                html += `
                    <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                        <div style="height: 120px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                            ${f.img ? `<img src="${f.img}" style="width:100%; height:100%; object-fit:cover;">` : `<i class='bx bx-image' style="font-size: 3rem; color: #ccc;"></i>`}
                        </div>
                        <div style="padding: 15px;">
                            <div style="font-weight: bold; margin-bottom: 5px; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${f.name}</div>
                            <div style="color: #666; font-size: 0.85rem; margin-bottom: 15px;">사이즈: ${f.size || '-'}</div>
                            <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; text-align: right;">
                                <div style="font-size: 0.8rem; color: #888; margin-bottom: 3px;">이번 달 누적 금액</div>
                                <div style="font-weight: bold; color: #A50034; font-size: 1.1rem;">${accCost.toLocaleString()}원</div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div>`;

    } else {
        // 그룹별 (팀별 또는 채널별)
        let groups = [];
        if (app.currentMonthlyType === 'marketing') {
            groups = [
                { name: '마케팅팀1', amount: 4500000 },
                { name: '마케팅팀2', amount: 3200000 },
                { name: '마케팅팀3', amount: 1500000 },
                { name: '마케팅팀4', amount: 5600000 },
                { name: '마케팅팀5', amount: 2100000 },
                { name: '마케팅팀6', amount: 800000 },
                { name: '마케팅팀7', amount: 9500000 }
            ];
        } else {
            groups = [
                { name: 'DP 비용', amount: 12500000 },
                { name: 'Hip 비용', amount: 8400000 },
                { name: '지점판촉비', amount: 5200000 }
            ];
        }

        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px;">`;
        groups.forEach(g => {
            html += `
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.02); text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 120px;">
                    <div style="font-weight: bold; font-size: 1.1rem; color: #333; margin-bottom: 15px;">${g.name}</div>
                    <div style="font-size: 1.4rem; font-weight: bold; color: #A50034;">${g.amount.toLocaleString()}원</div>
                </div>
            `;
        });
        html += `</div>`;
    }

    wrap.innerHTML = html;
};
