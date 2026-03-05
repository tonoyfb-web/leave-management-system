// ==================== js/script.js ====================
// Leave Management System - Main JavaScript

// ==================== DATA STRUCTURES ====================
let employees = [];
let departments = [];
let designations = [];
let leaveTypes = [];
let leaveRequests = [];
let leaveBalances = [];

// Notification System
let notifications = [];
let notificationId = 1;

// Notification Types
const NOTIFICATION_TYPES = {
    LEAVE_APPLIED: 'leave_applied',
    LEAVE_APPROVED: 'leave_approved',
    LEAVE_REJECTED: 'leave_rejected',
    LEAVE_CANCELLED: 'leave_cancelled',
    INFO: 'info'
};

// Current logged in user
let currentUser = null;
let selectedRole = 'employee';
let currentRejectId = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load data from localStorage first
    loadFromLocalStorage();
    
    // If no data in localStorage, initialize with sample data
    if (employees.length === 0) {
        initializeSampleData();
        saveToLocalStorage();
    }
    
    updateUserList();
    
    // Update notification badge
    updateNotificationBadge();
    renderNotifications();
    
    // Close notification panel when clicking outside
    setupNotificationClose();
});

// ==================== LOCAL STORAGE FUNCTIONS ====================
function saveToLocalStorage() {
    localStorage.setItem('hr_employees', JSON.stringify(employees));
    localStorage.setItem('hr_departments', JSON.stringify(departments));
    localStorage.setItem('hr_designations', JSON.stringify(designations));
    localStorage.setItem('hr_leaveTypes', JSON.stringify(leaveTypes));
    localStorage.setItem('hr_leaveRequests', JSON.stringify(leaveRequests));
    localStorage.setItem('hr_leaveBalances', JSON.stringify(leaveBalances));
    localStorage.setItem('hr_notifications', JSON.stringify(notifications));
    localStorage.setItem('hr_notificationId', notificationId.toString());
}

function loadFromLocalStorage() {
    // Load employees
    const savedEmployees = localStorage.getItem('hr_employees');
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    }

    // Load departments
    const savedDepartments = localStorage.getItem('hr_departments');
    if (savedDepartments) {
        departments = JSON.parse(savedDepartments);
    }

    // Load designations
    const savedDesignations = localStorage.getItem('hr_designations');
    if (savedDesignations) {
        designations = JSON.parse(savedDesignations);
    }

    // Load leave types
    const savedLeaveTypes = localStorage.getItem('hr_leaveTypes');
    if (savedLeaveTypes) {
        leaveTypes = JSON.parse(savedLeaveTypes);
    }

    // Load leave requests
    const savedLeaveRequests = localStorage.getItem('hr_leaveRequests');
    if (savedLeaveRequests) {
        leaveRequests = JSON.parse(savedLeaveRequests);
    }

    // Load leave balances
    const savedLeaveBalances = localStorage.getItem('hr_leaveBalances');
    if (savedLeaveBalances) {
        leaveBalances = JSON.parse(savedLeaveBalances);
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('hr_notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    }

    // Load notification ID
    const savedNotifId = localStorage.getItem('hr_notificationId');
    if (savedNotifId) {
        notificationId = parseInt(savedNotifId);
    }
}

// ==================== SAMPLE DATA INITIALIZATION ====================
function initializeSampleData() {
    // Initialize Departments
    departments = [
        { id: 'CNF', name: 'Clearing and Forwarding', description: 'C&F' },
        { id: 'HRA', name: 'HR & Admin', description: 'HR Department' },
        { id: 'COM', name: 'Commercial', description: 'Trading' },
        { id: 'ACT', name: 'Accounts', description: 'Accounts and Finance' },
        { id: 'ADM', name: 'Administration', description: 'Administration' }
    ];

    // Initialize Designations
    designations = [
        { id: 'DESIG001', name: 'Assistant Manager', department: 'Clearing and Forwarding', level: 1 },
        { id: 'DESIG002', name: 'Deputy Manager', department: 'Clearing and Forwarding', level: 2 },
        { id: 'DESIG003', name: 'Manager', department: 'Clearing and Forwarding', level: 3 },
        { id: 'DESIG004', name: 'Assistant Manager', department: 'HR & Admin', level: 1 },
        { id: 'DESIG005', name: 'Marketing Executive', department: 'Clearing and Forwarding', level: 1 },
        { id: 'DESIG006', name: 'Manager', department: 'Accounts', level: 3 },
        { id: 'DESIG007', name: 'Marketing Executive', department: 'Commercial', level: 1 },
        { id: 'DESIG008', name: 'Deputy Manager', department: 'Commercial', level: 2 },
        { id: 'DESIG009', name: 'Receptionist', department: 'Administration', level: 1 },
        { id: 'DESIG010', name: 'Jr. Marketing Executive', department: 'Clearing and Forwarding', level: 1 },
        { id: 'DESIG011', name: 'Driver', department: 'Administration', level: 1 },
        { id: 'DESIG012', name: 'Office Assistant', department: 'Administration', level: 1 },
        { id: 'DESIG013', name: 'Sr. Marketing Executive', department: 'Clearing and Forwarding', level: 2 },
        { id: 'DESIG014', name: 'Assistant Manager', department: 'Accounts', level: 1 },
        { id: 'DESIG015', name: 'Accounts Officer', department: 'Accounts', level: 1 },
        { id: 'DESIG016', name: 'Sr. Accountant', department: 'Accounts', level: 2 },
        { id: 'DESIG017', name: 'Sr. Accounts Officer', department: 'Accounts', level: 2 }
    ];

    // Initialize Leave Types
    leaveTypes = [
        { id: 1, name: 'Sick Leave', defaultDays: 15, color: '#ef4444', description: 'Sick Leave' },
        { id: 2, name: 'Casual Leave', defaultDays: 10, color: '#22c55e', description: 'Casual/emergency Leave' }
    ];

    // Initialize Employees
    employees = [
        { id: 'CLCNFDK01', name: 'Md. Shariful Islam', email: 'shariful@chevronlines.com', password: 'emp123', department: 'Clearing and Forwarding', designation: 'Deputy Manager', role: 'employee', joinDate: '2012-09-15', status: 'Active' },
        { id: 'CLCNFDK02', name: 'Mr. Pinto Ranjan Das', email: 'pinto@chevronlines.com', password: 'emp123', department: 'Clearing and Forwarding', designation: 'Deputy Manager', role: 'employee', joinDate: '2011-09-05', status: 'Active' },
        { id: 'NTCOMDK01', name: 'Mr. Moudud Ahmed', email: 'commercial@nastradingbd.com', password: 'emp123', department: 'Commercial', designation: 'Deputy Manager', role: 'employee', joinDate: '2011-07-13', status: 'Active' },
        { id: 'CLCNFDK03', name: 'Mr. Nasir Uddin', email: 'nasir@chevronlines.com', password: 'emp123', department: 'Clearing and Forwarding', designation: 'Assistant Manager', role: 'employee', joinDate: '2014-08-22', status: 'Active' },
        { id: 'CLCNFDK10', name: 'Mr. Mamunur Rashid', email: 'mamun@chevronlines.com', password: 'emp123', department: 'Clearing and Forwarding', designation: 'Assistant Manager', role: 'employee', joinDate: '2012-12-23', status: 'Active' },
        { id: 'CLCNFDK04', name: 'Md. Abdul Halim', email: 'abdulhalim@chevronlines.com', password: 'emp123', department: 'Clearing and Forwarding', designation: 'Assistant Manager', role: 'employee', joinDate: '2016-10-23', status: 'Active' },
        { id: 'CLACTDK01', name: 'Mr. Fazlay Rabby', email: 'fazlay.rabby@chevronlines.com', password: 'fazlay321', department: 'Accounts', designation: 'Manager', role: 'manager', joinDate: '2016-07-16', status: 'Active' },
        { id: 'CLCNFDK09', name: 'Mr. Liton Kumar Shil', email: 'liton@chevronlines.com', password: 'liton321', department: 'Clearing and Forwarding', designation: 'Manager', role: 'manager', joinDate: '2004-05-05', status: 'Active' },
        { id: 'CLADMDK07', name: 'Ms. Sharmin Akter', email: 'info@chevronlines.com', password: 'sharmin321', department: 'Administration', designation: 'Receptionist', role: 'employee', joinDate: '2026-02-08', status: 'Active' },
        { id: 'CLCNFCTG02', name: 'Mr. Abu Sayeed Toha', email: 'toha@chevronlines.com', password: 'toha321', department: 'Clearing and Forwarding', designation: 'Assistant Manager', role: 'employee', joinDate: '2013-04-13', status: 'Active' },
        { id: 'NFHRADK01', name: 'Abdullah Al Saki', email: 'saki@nasfreightsbd.com', password: 'hradmin123', department: 'HR & Admin', designation: 'Assistant Manager', role: 'admin', joinDate: '2017-01-01', status: 'Active' }
    ];

    // Initialize Leave Balances
    leaveBalances = [];
    employees.forEach(emp => {
        if (emp.role !== 'admin') {
            leaveTypes.forEach(type => {
                const used = Math.floor(Math.random() * (type.defaultDays / 2));
                leaveBalances.push({
                    id: `BAL${emp.id}${type.id}`,
                    employeeId: emp.id,
                    employeeName: emp.name,
                    leaveType: type.name,
                    totalDays: type.defaultDays,
                    usedDays: used,
                    availableDays: type.defaultDays - used,
                    color: type.color
                });
            });
        }
    });

    // Initialize Leave Requests (empty array for fresh start)
    leaveRequests = [];
    
    // Initialize Notifications (empty array)
    notifications = [];
}

// ==================== NOTIFICATION FUNCTIONS ====================
function createNotification(type, title, message, data = {}) {
    const notification = {
        id: notificationId++,
        type: type,
        title: title,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        read: false,
        userId: data.userId || (data.employeeId || null),
        forRole: data.forRole || null
    };
    
    notifications.unshift(notification);
    
    // Save to localStorage
    localStorage.setItem('hr_notifications', JSON.stringify(notifications));
    localStorage.setItem('hr_notificationId', notificationId.toString());
    
    updateNotificationBadge();
    renderNotifications();
    
    // Show toast notification
    showToast(type, title, message);
    
    return notification;
}

function getNotificationsForCurrentUser() {
    if (!currentUser) return [];
    
    // Admin sees all notifications
    if (currentUser.role === 'admin') {
        return notifications;
    }
    
    // Manager sees notifications for their department and general notifications
    return notifications.filter(n => 
        !n.userId || 
        n.userId === currentUser.id ||
        (n.data && n.data.department === currentUser.department) ||
        n.forRole === currentUser.role ||
        n.forRole === 'all'
    );
}

function updateNotificationBadge() {
    const userNotifications = getNotificationsForCurrentUser();
    const unreadCount = userNotifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
        badge.textContent = unreadCount;
        if (unreadCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    const userNotifications = getNotificationsForCurrentUser();
    
    if (userNotifications.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-bell-slash fa-2x mb-2"></i>
                <p>No new notifications</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userNotifications.map(n => {
        const timeAgo = getTimeAgo(new Date(n.timestamp));
        const iconClass = getNotificationIcon(n.type);
        const iconColor = getNotificationColor(n.type);
        
        return `
            <div class="notification-item ${!n.read ? 'unread' : ''}" onclick="markAsRead(${n.id})">
                <div class="d-flex">
                    <div class="notification-icon" style="background: ${iconColor}20; color: ${iconColor}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${n.title}</div>
                        <div class="notification-message">${n.message}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                    ${!n.read ? '<span class="badge bg-primary ms-2">New</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getNotificationIcon(type) {
    switch(type) {
        case NOTIFICATION_TYPES.LEAVE_APPLIED:
            return 'fa-paper-plane';
        case NOTIFICATION_TYPES.LEAVE_APPROVED:
            return 'fa-check-circle';
        case NOTIFICATION_TYPES.LEAVE_REJECTED:
            return 'fa-times-circle';
        case NOTIFICATION_TYPES.LEAVE_CANCELLED:
            return 'fa-ban';
        default:
            return 'fa-bell';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case NOTIFICATION_TYPES.LEAVE_APPLIED:
            return '#3b82f6';
        case NOTIFICATION_TYPES.LEAVE_APPROVED:
            return '#10b981';
        case NOTIFICATION_TYPES.LEAVE_REJECTED:
            return '#ef4444';
        case NOTIFICATION_TYPES.LEAVE_CANCELLED:
            return '#f59e0b';
        default:
            return '#6b7280';
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.classList.toggle('show');
}

function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('hr_notifications', JSON.stringify(notifications));
        updateNotificationBadge();
        renderNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    localStorage.setItem('hr_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
    renderNotifications();
    showToast('info', 'Notifications', 'All notifications marked as read');
}

function clearAllNotifications() {
    notifications = notifications.filter(n => n.read === false);
    localStorage.setItem('hr_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
    renderNotifications();
    showToast('info', 'Notifications', 'Read notifications cleared');
}

function showToast(type, title, message) {
    const toastId = 'toast-' + Date.now();
    let icon = 'fa-info-circle';
    let color = '#3b82f6';
    
    if (type === NOTIFICATION_TYPES.LEAVE_APPLIED || type === 'info') {
        icon = 'fa-info-circle';
        color = '#3b82f6';
    } else if (type === NOTIFICATION_TYPES.LEAVE_APPROVED || type === 'success') {
        icon = 'fa-check-circle';
        color = '#10b981';
    } else if (type === NOTIFICATION_TYPES.LEAVE_REJECTED || type === 'error') {
        icon = 'fa-times-circle';
        color = '#ef4444';
    } else if (type === NOTIFICATION_TYPES.LEAVE_CANCELLED || type === 'warning') {
        icon = 'fa-exclamation-triangle';
        color = '#f59e0b';
    }
    
    const toastHtml = `
        <div class="toast-message ${type}" id="${toastId}">
            <div class="toast-icon" style="background: ${color}20; color: ${color}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-text">${message}</div>
            </div>
        </div>
    `;
    
    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', toastHtml);
    
    setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) toast.remove();
    }, 5000);
}

function setupNotificationClose() {
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('notificationPanel');
        const bell = document.querySelector('.notification-bell');
        
        if (panel && bell && !panel.contains(event.target) && !bell.contains(event.target) && panel.classList.contains('show')) {
            panel.classList.remove('show');
        }
    });
}

// ==================== LOGIN FUNCTIONS ====================
function setRole(role) {
    selectedRole = role;
    
    // Update active button
    document.getElementById('empRoleBtn')?.classList.remove('active');
    document.getElementById('mgrRoleBtn')?.classList.remove('active');
    document.getElementById('adminRoleBtn')?.classList.remove('active');
    
    if (role === 'employee') {
        document.getElementById('empRoleBtn')?.classList.add('active');
        document.getElementById('loginLabel').textContent = 'Employee ID';
    } else if (role === 'manager') {
        document.getElementById('mgrRoleBtn')?.classList.add('active');
        document.getElementById('loginLabel').textContent = 'Manager ID';
    } else {
        document.getElementById('adminRoleBtn')?.classList.add('active');
        document.getElementById('loginLabel').textContent = 'Admin Username';
    }
    
    updateUserList();
}

function updateUserList() {
    const container = document.getElementById('userButtons');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filteredUsers = employees.filter(emp => emp.role === selectedRole);
    
    filteredUsers.forEach(user => {
        const btn = document.createElement('button');
        btn.className = `user-badge ${user.role}`;
        btn.innerHTML = `<i class="fas fa-${user.role === 'admin' ? 'crown' : (user.role === 'manager' ? 'user-tie' : 'user')}"></i> ${user.name}`;
        btn.onclick = () => fillCredentials(user.id, user.password);
        container.appendChild(btn);
    });
}

function fillCredentials(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Find user
    const user = employees.find(emp => 
        (emp.id === username || emp.email === username) && 
        emp.password === password && 
        emp.role === selectedRole
    );
    
    if (user) {
        currentUser = user;
        document.getElementById('loginError').style.display = 'none';
        showMainApp();
        loadUserDashboard();
        
        // Create welcome notification
        createNotification(
            NOTIFICATION_TYPES.INFO,
            'Login Successful',
            `Welcome back, ${user.name}!`,
            { userId: user.id }
        );
    } else {
        document.getElementById('errorMessage').textContent = 'Invalid credentials or role mismatch';
        document.getElementById('loginError').style.display = 'block';
    }
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
}

function logout() {
    currentUser = null;
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// ==================== USER DASHBOARD ====================
function loadUserDashboard() {
    // Update header
    document.getElementById('displayName').textContent = currentUser.name;
    document.getElementById('displayId').textContent = currentUser.id;
    document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name.split(' ')[0]}!`;
    document.getElementById('userDepartment').textContent = currentUser.department;
    
    // Update avatar
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('');
    avatar.style.background = currentUser.role === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                            (currentUser.role === 'manager' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)');
    
    // Update role badge
    const roleBadge = document.getElementById('userRoleBadge');
    roleBadge.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    roleBadge.className = `role-badge ${currentUser.role}`;
    
    // Show/hide tabs based on role
    document.getElementById('pendingTab').style.display = 
        (currentUser.role === 'manager' || currentUser.role === 'admin') ? 'block' : 'none';
    document.getElementById('adminTab').style.display = 
        currentUser.role === 'admin' ? 'block' : 'none';
    
    // Load data
    updateStatistics();
    loadLeaveBalance();
    loadRecentActivity();
    loadMyLeaves();
    loadLeaveTypesForApply();
    
    if (currentUser.role === 'manager' || currentUser.role === 'admin') {
        loadPendingRequests();
    }
    
    if (currentUser.role === 'admin') {
        loadAdminData();
    }
    
    // Update quick actions
    updateQuickActions();
    
    // Update notification badge
    updateNotificationBadge();
    renderNotifications();
}

function updateQuickActions() {
    const container = document.getElementById('quickActions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentUser.role === 'employee') {
        container.innerHTML = `
            <button class="quick-action-btn" onclick="document.getElementById('apply-tab').click()">
                <i class="fas fa-pen"></i> Apply Leave
            </button>
            <button class="quick-action-btn" onclick="exportMyLeaves()">
                <i class="fas fa-download"></i> Export
            </button>
            <button class="quick-action-btn" onclick="refreshData()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
        `;
    } else if (currentUser.role === 'manager') {
        container.innerHTML = `
            <button class="quick-action-btn" onclick="document.getElementById('pending-tab').click()">
                <i class="fas fa-clock"></i> Pending (${getPendingCount()})
            </button>
            <button class="quick-action-btn" onclick="exportTeamLeaves()">
                <i class="fas fa-file-excel"></i> Team Report
            </button>
            <button class="quick-action-btn" onclick="refreshData()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
        `;
    } else {
        container.innerHTML = `
            <button class="quick-action-btn" onclick="document.getElementById('admin-tab').click()">
                <i class="fas fa-cog"></i> Admin Panel
            </button>
            <button class="quick-action-btn" onclick="exportAllData()">
                <i class="fas fa-database"></i> Export All
            </button>
            <button class="quick-action-btn" onclick="generateReport()">
                <i class="fas fa-chart-bar"></i> Reports
            </button>
            <button class="quick-action-btn" onclick="refreshData()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
        `;
    }
}

function updateStatistics() {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    if (currentUser.role === 'employee') {
        const userLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id);
        const approved = userLeaves.filter(l => l.status === 'Approved').length;
        const pending = userLeaves.filter(l => l.status === 'Pending').length;
        const totalDays = userLeaves.reduce((sum, l) => sum + l.days, 0);
        
        statsContainer.innerHTML = `
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5;">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="stats-label">Total Leaves</div>
                    <div class="stats-value">${userLeaves.length}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stats-label">Approved</div>
                    <div class="stats-value">${approved}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stats-label">Pending</div>
                    <div class="stats-value">${pending}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stats-label">Total Days</div>
                    <div class="stats-value">${totalDays}</div>
                </div>
            </div>
        `;
    } else {
        const totalEmployees = employees.filter(e => e.role !== 'admin').length;
        const pendingCount = leaveRequests.filter(l => l.status === 'Pending').length;
        const approvedCount = leaveRequests.filter(l => l.status === 'Approved').length;
        const totalRequests = leaveRequests.length;
        
        statsContainer.innerHTML = `
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5;">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stats-label">Total Employees</div>
                    <div class="stats-value">${totalEmployees}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stats-label">Pending</div>
                    <div class="stats-value">${pendingCount}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stats-label">Approved</div>
                    <div class="stats-value">${approvedCount}</div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="stats-card">
                    <div class="stats-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stats-label">Total Requests</div>
                    <div class="stats-value">${totalRequests}</div>
                </div>
            </div>
        `;
    }
}

// ==================== LEAVE BALANCE FUNCTIONS ====================
function loadLeaveBalance() {
    const container = document.getElementById('leaveBalanceContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const userBalances = leaveBalances.filter(b => b.employeeId === currentUser.id);
    
    if (userBalances.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No leave balance data available</p>';
        return;
    }

    let totalAvailable = 0;
    
    userBalances.forEach(balance => {
        const percentage = (balance.usedDays / balance.totalDays) * 100;
        totalAvailable += balance.availableDays;
        
        container.innerHTML += `
            <div class="balance-item">
                <div class="balance-info">
                    <span class="balance-label">${balance.leaveType}</span>
                    <span class="balance-values">${balance.usedDays}/${balance.totalDays} days</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${percentage}%; background: ${balance.color}"
                         aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
                <div class="text-end mt-1">
                    <small class="text-muted">Available: ${balance.availableDays} days</small>
                </div>
            </div>
        `;
    });

    container.innerHTML += `
        <hr>
        <div class="d-flex justify-content-between">
            <span class="fw-600">Total Available:</span>
            <span class="fw-600 text-primary">${totalAvailable} days</span>
        </div>
    `;
}

// ==================== LEAVE APPLICATION FUNCTIONS ====================
function loadLeaveTypesForApply() {
    const select = document.getElementById('leaveType');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Leave Type</option>';
    
    const userBalances = leaveBalances.filter(b => b.employeeId === currentUser.id);
    
    userBalances.forEach(balance => {
        if (balance.availableDays > 0) {
            select.innerHTML += `<option value="${balance.leaveType}" data-balance="${balance.availableDays}" data-color="${balance.color}">
                ${balance.leaveType} (${balance.availableDays} days left)
            </option>`;
        }
    });
}

function updateAvailableBalance() {
    const select = document.getElementById('leaveType');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        const balance = selectedOption.getAttribute('data-balance');
        document.getElementById('availableBalance').value = balance + ' days';
    } else {
        document.getElementById('availableBalance').value = '';
    }
    
    calculateDays();
}

function calculateDays() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            alert('End date cannot be before start date');
            document.getElementById('endDate').value = '';
            return;
        }
        
        // Calculate working days (excluding weekends)
        let days = 0;
        let current = new Date(start);
        
        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                days++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        document.getElementById('totalDays').textContent = days;
        
        // Check balance
        const select = document.getElementById('leaveType');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.value) {
            const balance = parseFloat(selectedOption.getAttribute('data-balance'));
            
            if (days > balance) {
                document.getElementById('balanceWarning').style.display = 'block';
                document.getElementById('balanceMessage').textContent = 
                    `Insufficient balance! Available: ${balance} days`;
            } else {
                document.getElementById('balanceWarning').style.display = 'none';
            }
        }
    }
}

function resetApplicationForm() {
    document.getElementById('leaveApplicationForm').reset();
    document.getElementById('totalDays').textContent = '0';
    document.getElementById('balanceWarning').style.display = 'none';
    document.getElementById('availableBalance').value = '';
}

function submitLeaveApplication() {
    const leaveType = document.getElementById('leaveType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;
    const contact = document.getElementById('contact').value;
    const days = parseInt(document.getElementById('totalDays').textContent);
    
    if (!leaveType || !startDate || !endDate || !reason) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (days === 0) {
        alert('Please select valid dates');
        return;
    }
    
    // Check balance
    const select = document.getElementById('leaveType');
    const selectedOption = select.options[select.selectedIndex];
    const balance = parseFloat(selectedOption.getAttribute('data-balance'));
    const color = selectedOption.getAttribute('data-color');
    
    if (days > balance) {
        alert('Insufficient leave balance!');
        return;
    }
    
    // Create new leave request
    const newRequest = {
        id: 'REQ' + (leaveRequests.length + 1).toString().padStart(3, '0'),
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        department: currentUser.department,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        days: days,
        reason: reason,
        contact: contact,
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
        color: color
    };
    
    leaveRequests.push(newRequest);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Create notification for employee (confirmation)
    createNotification(
        NOTIFICATION_TYPES.LEAVE_APPLIED,
        'Leave Application Submitted',
        `Your ${leaveType} request for ${days} days has been submitted successfully.`,
        { userId: currentUser.id }
    );
    
    // Find manager for this department
    const manager = employees.find(emp => 
        emp.role === 'manager' && emp.department === currentUser.department
    );
    
    // Create notification for manager
    if (manager) {
        createNotification(
            NOTIFICATION_TYPES.LEAVE_APPLIED,
            'New Leave Application',
            `${currentUser.name} has applied for ${days} days ${leaveType} leave.`,
            { 
                userId: manager.id,
                employeeId: currentUser.id,
                department: currentUser.department
            }
        );
    }
    
    // Create notification for admin
    const admin = employees.find(emp => emp.role === 'admin');
    if (admin) {
        createNotification(
            NOTIFICATION_TYPES.LEAVE_APPLIED,
            'New Leave Application (Admin)',
            `${currentUser.name} (${currentUser.department}) has applied for ${days} days ${leaveType} leave.`,
            { userId: admin.id, forRole: 'admin' }
        );
    }
    
    // Reset and close
    resetApplicationForm();
    document.getElementById('apply-tab').click();
    
    showToast('success', 'Success', 'Leave application submitted successfully!');
    loadMyLeaves();
    updateStatistics();
    
    // Update pending badge if user is manager/admin
    if (currentUser.role === 'manager' || currentUser.role === 'admin') {
        loadPendingRequests();
    }
}

// ==================== MY LEAVES FUNCTIONS ====================
function loadMyLeaves() {
    const tbody = document.getElementById('myLeavesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const userLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
    
    userLeaves.forEach(leave => {
        const statusClass = getStatusClass(leave.status);
        const leaveType = leaveTypes.find(t => t.name === leave.leaveType);
        const color = leaveType ? leaveType.color : '#4f46e5';
        
        tbody.innerHTML += `
            <tr>
                <td><span class="fw-600">${leave.id}</span></td>
                <td>
                    <span class="badge" style="background: ${color}20; color: ${color}">
                        ${leave.leaveType}
                    </span>
                </td>
                <td>${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}</td>
                <td><span class="badge bg-info">${leave.days} days</span></td>
                <td>
                    <span data-bs-toggle="tooltip" title="${leave.reason}">
                        ${leave.reason.substring(0, 20)}...
                    </span>
                </td>
                <td>${formatDate(leave.appliedOn)}</td>
                <td><span class="badge bg-${statusClass}">${leave.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewRequestDetails('${leave.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${leave.status === 'Pending' ? 
                        `<button class="btn btn-sm btn-danger" onclick="cancelRequest('${leave.id}')">
                            <i class="fas fa-times"></i>
                        </button>` : ''}
                </td>
            </tr>
        `;
    });
}

function loadRecentActivity() {
    const tbody = document.getElementById('recentActivityBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const userLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id)
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
        .slice(0, 5);
    
    userLeaves.forEach(leave => {
        const statusClass = getStatusClass(leave.status);
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDate(leave.appliedOn)}</td>
                <td>${leave.leaveType}</td>
                <td>${leave.days}</td>
                <td><span class="badge bg-${statusClass}">${leave.status}</span></td>
            </tr>
        `;
    });
}

function cancelRequest(requestId) {
    if (confirm('Are you sure you want to cancel this request?')) {
        const request = leaveRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'Cancelled';
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Create notification for cancellation
            createNotification(
                NOTIFICATION_TYPES.LEAVE_CANCELLED,
                'Leave Request Cancelled',
                `Your ${request.leaveType} request has been cancelled.`,
                { userId: currentUser.id }
            );
            
            loadMyLeaves();
            showToast('info', 'Request Cancelled', 'Your leave request has been cancelled');
        }
    }
}

// ==================== PENDING REQUESTS (Manager/Admin) ====================
function loadPendingRequests() {
    const tbody = document.getElementById('pendingBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let pending = [];
    
    if (currentUser.role === 'admin') {
        pending = leaveRequests.filter(l => l.status === 'Pending');
    } else if (currentUser.role === 'manager') {
        pending = leaveRequests.filter(l => 
            l.status === 'Pending' && 
            l.department === currentUser.department
        );
    }
    
    document.getElementById('pendingBadge').textContent = pending.length;
    document.getElementById('pendingCount').textContent = pending.length + ' Pending';
    
    pending.forEach(request => {
        const leaveType = leaveTypes.find(t => t.name === request.leaveType);
        const color = leaveType ? leaveType.color : '#4f46e5';
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2" style="background: ${color}20; color: ${color}">
                            ${request.employeeName.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-600">${request.employeeName}</div>
                            <small class="text-muted">${request.employeeId}</small>
                        </div>
                    </div>
                </td>
                <td>${request.department}</td>
                <td>
                    <span class="badge" style="background: ${color}20; color: ${color}">
                        ${request.leaveType}
                    </span>
                </td>
                <td>${formatDate(request.startDate)} - ${formatDate(request.endDate)}</td>
                <td><span class="badge bg-info">${request.days} days</span></td>
                <td>
                    <span data-bs-toggle="tooltip" title="${request.reason}">
                        ${request.reason.substring(0, 25)}...
                    </span>
                </td>
                <td>${formatDate(request.appliedOn)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-success" onclick="approveRequest('${request.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openRejectModal('${request.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="viewRequestDetails('${request.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function getPendingCount() {
    if (currentUser.role === 'admin') {
        return leaveRequests.filter(l => l.status === 'Pending').length;
    } else if (currentUser.role === 'manager') {
        return leaveRequests.filter(l => 
            l.status === 'Pending' && 
            l.department === currentUser.department
        ).length;
    }
    return 0;
}

function approveRequest(requestId) {
    if (confirm('Are you sure you want to approve this leave request?')) {
        const request = leaveRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'Approved';
            request.approvedBy = currentUser.name;
            request.approvedOn = new Date().toISOString().split('T')[0];
            
            // Update leave balance
            const balance = leaveBalances.find(b => 
                b.employeeId === request.employeeId && 
                b.leaveType === request.leaveType
            );
            
            if (balance) {
                balance.usedDays += request.days;
                balance.availableDays = balance.totalDays - balance.usedDays;
            }
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Create notification for employee
            createNotification(
                NOTIFICATION_TYPES.LEAVE_APPROVED,
                'Leave Request Approved',
                `Your ${request.leaveType} request for ${request.days} days has been approved by ${currentUser.name}.`,
                { userId: request.employeeId }
            );
            
            // Create notification for admin if approver is manager
            if (currentUser.role === 'manager') {
                const admin = employees.find(emp => emp.role === 'admin');
                if (admin) {
                    createNotification(
                        NOTIFICATION_TYPES.LEAVE_APPROVED,
                        'Leave Request Approved',
                        `${request.employeeName}'s ${request.leaveType} request was approved by ${currentUser.name}.`,
                        { userId: admin.id, forRole: 'admin' }
                    );
                }
            }
            
            loadPendingRequests();
            showToast('success', 'Request Approved', `Leave request for ${request.employeeName} has been approved`);
        }
    }
}

function openRejectModal(requestId) {
    currentRejectId = requestId;
    document.getElementById('rejectionReason').value = '';
    new bootstrap.Modal(document.getElementById('rejectModal')).show();
}

function confirmReject() {
    const reason = document.getElementById('rejectionReason').value;
    if (!reason) {
        alert('Please provide a reason for rejection');
        return;
    }
    
    const request = leaveRequests.find(r => r.id === currentRejectId);
    if (request) {
        request.status = 'Rejected';
        request.rejectionReason = reason;
        request.rejectedBy = currentUser.name;
        request.rejectedOn = new Date().toISOString().split('T')[0];
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Create notification for employee
        createNotification(
            NOTIFICATION_TYPES.LEAVE_REJECTED,
            'Leave Request Rejected',
            `Your ${request.leaveType} request has been rejected. Reason: ${reason}`,
            { userId: request.employeeId }
        );
        
        // Create notification for admin if rejector is manager
        if (currentUser.role === 'manager') {
            const admin = employees.find(emp => emp.role === 'admin');
            if (admin) {
                createNotification(
                    NOTIFICATION_TYPES.LEAVE_REJECTED,
                    'Leave Request Rejected',
                    `${request.employeeName}'s ${request.leaveType} request was rejected by ${currentUser.name}. Reason: ${reason}`,
                    { userId: admin.id, forRole: 'admin' }
                );
            }
        }
        
        loadPendingRequests();
        bootstrap.Modal.getInstance(document.getElementById('rejectModal')).hide();
        showToast('error', 'Request Rejected', `Leave request for ${request.employeeName} has been rejected`);
    }
}

function viewRequestDetails(requestId) {
    const request = leaveRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const leaveType = leaveTypes.find(t => t.name === request.leaveType);
    const color = leaveType ? leaveType.color : '#4f46e5';
    
    let detailsHtml = `
        <table class="table table-sm">
            <tr><th>Request ID:</th><td>${request.id}</td></tr>
            <tr><th>Employee:</th><td>${request.employeeName}</td></tr>
            <tr><th>Department:</th><td>${request.department}</td></tr>
            <tr><th>Leave Type:</th><td><span class="badge" style="background: ${color}20; color: ${color}">${request.leaveType}</span></td></tr>
            <tr><th>Duration:</th><td>${formatDate(request.startDate)} to ${formatDate(request.endDate)}</td></tr>
            <tr><th>Days:</th><td>${request.days}</td></tr>
            <tr><th>Reason:</th><td>${request.reason}</td></tr>
            <tr><th>Applied On:</th><td>${formatDate(request.appliedOn)}</td></tr>
            <tr><th>Status:</th><td><span class="badge bg-${getStatusClass(request.status)}">${request.status}</span></td></tr>
    `;
    
    if (request.approvedBy) {
        detailsHtml += `<tr><th>Approved By:</th><td>${request.approvedBy} on ${formatDate(request.approvedOn)}</td></tr>`;
    }
    
    if (request.rejectionReason) {
        detailsHtml += `<tr><th>Rejection Reason:</th><td>${request.rejectionReason}</td></tr>`;
    }
    
    detailsHtml += '</table>';
    
    document.getElementById('viewDetails').innerHTML = detailsHtml;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// ==================== ADMIN FUNCTIONS ====================
function loadAdminData() {
    loadEmployeesTable();
    loadDepartmentsTable();
    loadDesignationsTable();
    loadLeaveTypesTable();
    loadBalancesTable();
    populateAdminDropdowns();
}

function loadEmployeesTable() {
    const tbody = document.getElementById('employeesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.designation}</td>
                <td><span class="badge bg-${emp.status === 'Active' ? 'success' : 'secondary'}">${emp.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editEmployee('${emp.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function loadDepartmentsTable() {
    const tbody = document.getElementById('departmentsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    departments.forEach(dept => {
        tbody.innerHTML += `
            <tr>
                <td>${dept.id}</td>
                <td>${dept.name}</td>
                <td>${dept.description || ''}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editDepartment('${dept.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDepartment('${dept.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function loadDesignationsTable() {
    const tbody = document.getElementById('designationsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    designations.forEach(desig => {
        tbody.innerHTML += `
            <tr>
                <td>${desig.id}</td>
                <td>${desig.name}</td>
                <td>${desig.department}</td>
                <td>Level ${desig.level}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editDesignation('${desig.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDesignation('${desig.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function loadLeaveTypesTable() {
    const tbody = document.getElementById('leaveTypesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    leaveTypes.forEach(type => {
        tbody.innerHTML += `
            <tr>
                <td>${type.id}</td>
                <td>
                    <span class="badge" style="background: ${type.color}20; color: ${type.color}">
                        ${type.name}
                    </span>
                </td>
                <td>${type.defaultDays} days</td>
                <td><span style="display:inline-block; width:20px; height:20px; background:${type.color}; border-radius:4px;"></span> ${type.color}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editLeaveType(${type.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLeaveType(${type.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function loadBalancesTable() {
    const tbody = document.getElementById('balancesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    leaveBalances.forEach(balance => {
        tbody.innerHTML += `
            <tr>
                <td>${balance.employeeName}</td>
                <td>${balance.leaveType}</td>
                <td>${balance.totalDays}</td>
                <td>${balance.usedDays}</td>
                <td class="fw-600" style="color: ${balance.color}">${balance.availableDays}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editBalance('${balance.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function populateAdminDropdowns() {
    // Employee department dropdown
    const deptSelect = document.getElementById('empDepartment');
    if (deptSelect) {
        deptSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            deptSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }
    
    // Employee designation dropdown
    const desigSelect = document.getElementById('empDesignation');
    if (desigSelect) {
        desigSelect.innerHTML = '<option value="">Select Designation</option>';
        designations.forEach(desig => {
            desigSelect.innerHTML += `<option value="${desig.name}">${desig.name}</option>`;
        });
    }
    
    // Designation department dropdown
    const desigDeptSelect = document.getElementById('desigDepartment');
    if (desigDeptSelect) {
        desigDeptSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            desigDeptSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }
    
    // Balance filter dropdown
    const filterSelect = document.getElementById('balanceEmployeeFilter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">All Employees</option>';
        employees.forEach(emp => {
            if (emp.role !== 'admin') {
                filterSelect.innerHTML += `<option value="${emp.id}">${emp.name}</option>`;
            }
        });
    }
}

// Employee CRUD
function showAddEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = 'Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('empJoinDate').valueAsDate = new Date();
    new bootstrap.Modal(document.getElementById('employeeModal')).show();
}

function editEmployee(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    
    document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = emp.id;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empId').value = emp.id;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empPassword').value = emp.password;
    document.getElementById('empDepartment').value = emp.department;
    document.getElementById('empDesignation').value = emp.designation;
    document.getElementById('empRole').value = emp.role;
    document.getElementById('empJoinDate').value = emp.joinDate;
    
    new bootstrap.Modal(document.getElementById('employeeModal')).show();
}

function saveEmployee() {
    const empId = document.getElementById('employeeId').value;
    const empData = {
        name: document.getElementById('empName').value,
        id: document.getElementById('empId').value,
        email: document.getElementById('empEmail').value,
        password: document.getElementById('empPassword').value,
        department: document.getElementById('empDepartment').value,
        designation: document.getElementById('empDesignation').value,
        role: document.getElementById('empRole').value,
        joinDate: document.getElementById('empJoinDate').value,
        status: 'Active'
    };
    
    if (!empData.name || !empData.email || !empData.department || !empData.designation || !empData.joinDate) {
        alert('Please fill in all fields');
        return;
    }
    
    if (empId) {
        // Update existing
        const index = employees.findIndex(e => e.id === empId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...empData };
            createNotification(NOTIFICATION_TYPES.INFO, 'Employee Updated', `Employee ${empData.name} updated successfully`);
        }
    } else {
        // Check if employee ID already exists
        if (employees.some(e => e.id === empData.id)) {
            alert('Employee ID already exists');
            return;
        }
        
        // Add new
        employees.push(empData);
        
        // Create leave balances for new employee
        leaveTypes.forEach(type => {
            leaveBalances.push({
                id: `BAL${empData.id}${type.id}`,
                employeeId: empData.id,
                employeeName: empData.name,
                leaveType: type.name,
                totalDays: type.defaultDays,
                usedDays: 0,
                availableDays: type.defaultDays,
                color: type.color
            });
        });
        
        createNotification(NOTIFICATION_TYPES.INFO, 'New Employee Added', `Employee ${empData.name} has been added to the system`);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
    loadEmployeesTable();
    populateAdminDropdowns();
    showToast('success', 'Success', 'Employee saved successfully!');
}

function deleteEmployee(empId) {
    if (confirm('Are you sure you want to delete this employee? This will also delete all their leave data.')) {
        const employee = employees.find(e => e.id === empId);
        employees = employees.filter(e => e.id !== empId);
        leaveBalances = leaveBalances.filter(b => b.employeeId !== empId);
        leaveRequests = leaveRequests.filter(r => r.employeeId !== empId);
        
        // Save to localStorage
        saveToLocalStorage();
        
        loadEmployeesTable();
        populateAdminDropdowns();
        
        createNotification(NOTIFICATION_TYPES.INFO, 'Employee Deleted', `Employee ${employee.name} has been removed from the system`);
        showToast('warning', 'Employee Deleted', `Employee ${employee.name} has been deleted`);
    }
}

// Department CRUD
function showAddDepartmentModal() {
    document.getElementById('departmentForm').reset();
    document.getElementById('deptId').value = '';
    new bootstrap.Modal(document.getElementById('departmentModal')).show();
}

function saveDepartment() {
    const deptId = document.getElementById('deptId').value;
    const deptData = {
        name: document.getElementById('deptName').value,
        description: document.getElementById('deptDesc').value
    };
    
    if (!deptData.name) {
        alert('Please enter department name');
        return;
    }
    
    if (deptId) {
        // Update existing
        const index = departments.findIndex(d => d.id === deptId);
        if (index !== -1) {
            departments[index] = { ...departments[index], ...deptData };
        }
    } else {
        // Add new
        const newId = 'DEPT' + (departments.length + 1).toString().padStart(3, '0');
        departments.push({
            id: newId,
            ...deptData
        });
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    bootstrap.Modal.getInstance(document.getElementById('departmentModal')).hide();
    loadDepartmentsTable();
    populateAdminDropdowns();
    showToast('success', 'Success', 'Department saved successfully!');
}

function deleteDepartment(deptId) {
    if (confirm('Are you sure you want to delete this department?')) {
        const dept = departments.find(d => d.id === deptId);
        departments = departments.filter(d => d.id !== deptId);
        
        // Save to localStorage
        saveToLocalStorage();
        
        loadDepartmentsTable();
        showToast('warning', 'Department Deleted', `Department ${dept.name} has been deleted`);
    }
}

// Designation CRUD
function showAddDesignationModal() {
    document.getElementById('designationForm').reset();
    document.getElementById('desigId').value = '';
    new bootstrap.Modal(document.getElementById('designationModal')).show();
}

function saveDesignation() {
    const desigId = document.getElementById('desigId').value;
    const desigData = {
        name: document.getElementById('desigName').value,
        department: document.getElementById('desigDepartment').value,
        level: parseInt(document.getElementById('desigLevel').value)
    };
    
    if (!desigData.name || !desigData.department) {
        alert('Please fill in all fields');
        return;
    }
    
    if (desigId) {
        // Update existing
        const index = designations.findIndex(d => d.id === desigId);
        if (index !== -1) {
            designations[index] = { ...designations[index], ...desigData };
        }
    } else {
        // Add new
        const newId = 'DESIG' + (designations.length + 1).toString().padStart(3, '0');
        designations.push({
            id: newId,
            ...desigData
        });
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    bootstrap.Modal.getInstance(document.getElementById('designationModal')).hide();
    loadDesignationsTable();
    populateAdminDropdowns();
    showToast('success', 'Success', 'Designation saved successfully!');
}

function deleteDesignation(desigId) {
    if (confirm('Are you sure you want to delete this designation?')) {
        const desig = designations.find(d => d.id === desigId);
        designations = designations.filter(d => d.id !== desigId);
        
        // Save to localStorage
        saveToLocalStorage();
        
        loadDesignationsTable();
        showToast('warning', 'Designation Deleted', `Designation ${desig.name} has been deleted`);
    }
}

// Leave Type CRUD
function showAddLeaveTypeModal() {
    document.getElementById('leaveTypeForm').reset();
    document.getElementById('leaveTypeId').value = '';
    document.getElementById('typeColor').value = '#4f46e5';
    new bootstrap.Modal(document.getElementById('leaveTypeModal')).show();
}

function saveLeaveType() {
    const typeId = document.getElementById('leaveTypeId').value;
    const typeData = {
        name: document.getElementById('typeName').value,
        defaultDays: parseInt(document.getElementById('typeDays').value),
        color: document.getElementById('typeColor').value,
        description: document.getElementById('typeDesc').value
    };
    
    if (!typeData.name || !typeData.defaultDays) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (typeId) {
        // Update existing
        const index = leaveTypes.findIndex(t => t.id == typeId);
        if (index !== -1) {
            const oldDays = leaveTypes[index].defaultDays;
            leaveTypes[index] = { ...leaveTypes[index], ...typeData };
            
            // Update all balances with new default days
            leaveBalances.forEach(balance => {
                if (balance.leaveType === typeData.name) {
                    const difference = typeData.defaultDays - oldDays;
                    balance.totalDays = typeData.defaultDays;
                    balance.availableDays += difference;
                }
            });
        }
    } else {
        // Add new
        const newId = leaveTypes.length + 1;
        const newType = {
            id: newId,
            ...typeData
        };
        leaveTypes.push(newType);
        
        // Create balances for all employees
        employees.forEach(emp => {
            if (emp.role !== 'admin') {
                leaveBalances.push({
                    id: `BAL${emp.id}${newId}`,
                    employeeId: emp.id,
                    employeeName: emp.name,
                    leaveType: typeData.name,
                    totalDays: typeData.defaultDays,
                    usedDays: 0,
                    availableDays: typeData.defaultDays,
                    color: typeData.color
                });
            }
        });
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    bootstrap.Modal.getInstance(document.getElementById('leaveTypeModal')).hide();
    loadLeaveTypesTable();
    loadBalancesTable();
    showToast('success', 'Success', 'Leave type saved successfully!');
}

function editLeaveType(typeId) {
    const type = leaveTypes.find(t => t.id == typeId);
    if (!type) return;
    
    document.getElementById('leaveTypeId').value = type.id;
    document.getElementById('typeName').value = type.name;
    document.getElementById('typeDays').value = type.defaultDays;
    document.getElementById('typeColor').value = type.color;
    document.getElementById('typeDesc').value = type.description || '';
    
    new bootstrap.Modal(document.getElementById('leaveTypeModal')).show();
}

function deleteLeaveType(typeId) {
    if (confirm('Are you sure you want to delete this leave type? This will affect all employee balances.')) {
        const type = leaveTypes.find(t => t.id == typeId);
        leaveTypes = leaveTypes.filter(t => t.id != typeId);
        leaveBalances = leaveBalances.filter(b => b.leaveType !== type.name);
        
        // Save to localStorage
        saveToLocalStorage();
        
        loadLeaveTypesTable();
        loadBalancesTable();
        showToast('warning', 'Leave Type Deleted', `Leave type ${type.name} has been deleted`);
    }
}

// Balance Management
function editBalance(balanceId) {
    const balance = leaveBalances.find(b => b.id === balanceId);
    if (!balance) return;
    
    document.getElementById('balanceId').value = balance.id;
    document.getElementById('balanceEmployee').value = balance.employeeName;
    document.getElementById('balanceLeaveType').value = balance.leaveType;
    document.getElementById('balanceTotal').value = balance.totalDays;
    document.getElementById('balanceUsed').value = balance.usedDays;
    document.getElementById('balanceAvailable').value = balance.availableDays;
    
    new bootstrap.Modal(document.getElementById('balanceModal')).show();
}

function saveBalance() {
    const balanceId = document.getElementById('balanceId').value;
    const total = parseInt(document.getElementById('balanceTotal').value);
    const used = parseInt(document.getElementById('balanceUsed').value);
    
    if (used > total) {
        alert('Used days cannot exceed total days');
        return;
    }
    
    const balance = leaveBalances.find(b => b.id === balanceId);
    if (balance) {
        balance.totalDays = total;
        balance.usedDays = used;
        balance.availableDays = total - used;
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    bootstrap.Modal.getInstance(document.getElementById('balanceModal')).hide();
    loadBalancesTable();
    showToast('success', 'Balance Updated', 'Leave balance updated successfully!');
}

function filterBalances() {
    const filter = document.getElementById('balanceEmployeeFilter').value;
    
    if (filter) {
        const filteredBalances = leaveBalances.filter(b => b.employeeId === filter);
        displayFilteredBalances(filteredBalances);
    } else {
        loadBalancesTable();
    }
}

function displayFilteredBalances(balances) {
    const tbody = document.getElementById('balancesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    balances.forEach(balance => {
        tbody.innerHTML += `
            <tr>
                <td>${balance.employeeName}</td>
                <td>${balance.leaveType}</td>
                <td>${balance.totalDays}</td>
                <td>${balance.usedDays}</td>
                <td class="fw-600" style="color: ${balance.color}">${balance.availableDays}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editBalance('${balance.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// ==================== EXPORT FUNCTIONS ====================
function exportMyLeaves() {
    const userLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(userLeaves);
    XLSX.utils.book_append_sheet(wb, ws, 'My Leaves');
    
    const date = new Date().toISOString().split('T')[0];
    const filename = `${currentUser.name.replace(' ', '_')}_leaves_${date}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    showToast('success', 'Export Complete', 'Leaves exported successfully!');
}

function exportTeamLeaves() {
    const teamLeaves = leaveRequests.filter(l => l.department === currentUser.department);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(teamLeaves);
    XLSX.utils.book_append_sheet(wb, ws, 'Team Leaves');
    
    const date = new Date().toISOString().split('T')[0];
    const filename = `${currentUser.department}_team_leaves_${date}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    showToast('success', 'Export Complete', 'Team leaves exported successfully!');
}

function exportAllData() {
    const wb = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employees), 'Employees');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(departments), 'Departments');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(designations), 'Designations');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leaveTypes), 'Leave Types');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leaveBalances), 'Leave Balances');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leaveRequests), 'Leave Requests');
    
    const date = new Date().toISOString().split('T')[0];
    const filename = `leave_management_full_export_${date}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    showToast('success', 'Export Complete', 'All data exported successfully!');
}

function generateReport() {
    const reportData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach((month, index) => {
        const monthRequests = leaveRequests.filter(r => {
            const date = new Date(r.appliedOn);
            return date.getMonth() === index;
        });
        
        reportData.push({
            Month: month + ' 2024',
            'Total Requests': monthRequests.length,
            Approved: monthRequests.filter(r => r.status === 'Approved').length,
            Pending: monthRequests.filter(r => r.status === 'Pending').length,
            Rejected: monthRequests.filter(r => r.status === 'Rejected').length,
            'Total Days': monthRequests.reduce((sum, r) => sum + r.days, 0)
        });
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
    
    const date = new Date().toISOString().split('T')[0];
    const filename = `monthly_report_${date}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    showToast('success', 'Report Generated', 'Monthly report generated successfully!');
}

// ==================== UTILITY FUNCTIONS ====================
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateElement = document.getElementById('currentDateTime');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusClass(status) {
    switch(status) {
        case 'Approved': return 'success';
        case 'Pending': return 'warning';
        case 'Rejected': return 'danger';
        case 'Cancelled': return 'secondary';
        default: return 'secondary';
    }
}

// ==================== NAVIGATION FUNCTIONS ====================
function refreshData() {
    document.getElementById('spinner').classList.add('show');
    
    setTimeout(() => {
        loadUserDashboard();
        document.getElementById('spinner').classList.remove('show');
        showToast('info', 'Refreshed', 'Data refreshed successfully!');
    }, 500);
}

// Make functions globally available
window.setRole = setRole;
window.fillCredentials = fillCredentials;
window.handleLogin = handleLogin;
window.logout = logout;
window.toggleNotificationPanel = toggleNotificationPanel;
window.markAllAsRead = markAllAsRead;
window.clearAllNotifications = clearAllNotifications;
window.updateAvailableBalance = updateAvailableBalance;
window.calculateDays = calculateDays;
window.resetApplicationForm = resetApplicationForm;
window.submitLeaveApplication = submitLeaveApplication;
window.exportMyLeaves = exportMyLeaves;
window.exportTeamLeaves = exportTeamLeaves;
window.exportAllData = exportAllData;
window.generateReport = generateReport;
window.refreshData = refreshData;
window.viewRequestDetails = viewRequestDetails;
window.cancelRequest = cancelRequest;
window.approveRequest = approveRequest;
window.openRejectModal = openRejectModal;
window.confirmReject = confirmReject;
window.showAddEmployeeModal = showAddEmployeeModal;
window.editEmployee = editEmployee;
window.saveEmployee = saveEmployee;
window.deleteEmployee = deleteEmployee;
window.showAddDepartmentModal = showAddDepartmentModal;
window.saveDepartment = saveDepartment;
window.deleteDepartment = deleteDepartment;
window.showAddDesignationModal = showAddDesignationModal;
window.saveDesignation = saveDesignation;
window.deleteDesignation = deleteDesignation;
window.showAddLeaveTypeModal = showAddLeaveTypeModal;
window.saveLeaveType = saveLeaveType;
window.editLeaveType = editLeaveType;
window.deleteLeaveType = deleteLeaveType;
window.editBalance = editBalance;
window.saveBalance = saveBalance;
window.filterBalances = filterBalances;