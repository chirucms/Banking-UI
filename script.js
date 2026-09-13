// Dummy Data Initialization
const initializeData = () => {
    // Migration: If the old single-account user exists, clear it to force the new multi-account state
    const existingUser = localStorage.getItem('bank_user');
    if (existingUser && !JSON.parse(existingUser).accounts) {
        localStorage.removeItem('bank_user');
        localStorage.removeItem('bank_transactions');
    }

    if (!localStorage.getItem('bank_user')) {
        localStorage.setItem('bank_user', JSON.stringify({
            name: "Chiranjeevi",
            id: "CUST987654321",
            mobile: "+91 98765 43210",
            email: "chiranjeevi@example.com",
            address: "123 Finance Street, New Delhi, India",
            accounts: [
                {
                    accountNumber: "456789123000",
                    accountType: "Savings Account",
                    ifsc: "SHAK0001234",
                    branch: "Main Branch, ND",
                    openingDate: "2020-05-15",
                    balance: 245000.50,
                    status: "Active"
                }
            ]
        }));
    }

    if (!localStorage.getItem('bank_transactions')) {
        localStorage.setItem('bank_transactions', JSON.stringify([
            { id: "TXN1001", date: "2023-10-25", description: "Salary", type: "Credit", amount: 50000.00, status: "Success" },
            { id: "TXN1002", date: "2023-10-22", description: "Online Shopping", type: "Debit", amount: 1500.75, status: "Success" },
            { id: "TXN1003", date: "2023-10-20", description: "Electricity Bill", type: "Debit", amount: 850.00, status: "Success" },
            { id: "TXN1004", date: "2023-10-18", description: "Money Transfer to Jane", type: "Debit", amount: 5000.00, status: "Success" },
            { id: "TXN1005", date: "2023-10-15", description: "ATM Withdrawal", type: "Debit", amount: 2000.00, status: "Success" },
            { id: "TXN1006", date: "2023-10-10", description: "Cash Deposit", type: "Credit", amount: 10000.00, status: "Success" }
        ]));
    }
};

// Utilities
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Sidebar Injection and Active State
const renderSidebar = () => {
    const sidebarHtml = `
        <div class="sidebar-header">
            <i class="fas fa-university fa-2x" style="color: var(--accent-color);"></i>
            <h3>Shakti Bank</h3>
        </div>
        <ul class="nav-links">
            <li><a href="dashboard.html" class="nav-item" data-page="dashboard"><i class="fas fa-th-large"></i> Dashboard</a></li>
            <li><a href="account.html" class="nav-item" data-page="account"><i class="fas fa-user-circle"></i> My Account</a></li>
            <li><a href="transfer.html" class="nav-item" data-page="transfer"><i class="fas fa-exchange-alt"></i> Transfer Money</a></li>
            <li><a href="transactions.html" class="nav-item" data-page="transactions"><i class="fas fa-history"></i> Transactions</a></li>
            <li><a href="statement.html" class="nav-item" data-page="statement"><i class="fas fa-file-invoice-dollar"></i> Bank Statement</a></li>
            <li style="margin-top: auto;"><a href="#" class="nav-item" onclick="handleLogout(event)"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    `;
    
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.innerHTML = sidebarHtml;
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
        const activeLink = sidebar.querySelector(`[data-page="${currentPage}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
};

const renderHeader = () => {
    const user = JSON.parse(localStorage.getItem('bank_user'));
    const header = document.getElementById('topHeader');
    if (header && user) {
        header.innerHTML = `
            <button class="menu-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
            <div class="header-search">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search transactions, accounts...">
            </div>
            <div class="header-right">
                <div class="notifications">
                    <i class="fas fa-bell fa-lg"></i>
                    <span class="badge">3</span>
                </div>
                <div class="user-profile">
                    <div class="avatar">${user.name.charAt(0)}</div>
                    <span style="font-weight: 500;">${user.name}</span>
                    <i class="fas fa-chevron-down" style="font-size: 12px; color: var(--text-light);"></i>
                </div>
            </div>
        `;
    }
};

const toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('active');
};

const handleLogout = (e) => {
    if(e) e.preventDefault();
    if(confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
};

// Page specific logic
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    renderSidebar();
    renderHeader();

    const page = window.location.pathname.split('/').pop();
    
    if (page === 'index.html' || page === '') {
        initLogin();
    } else if (page === 'dashboard.html') {
        initDashboard();
    } else if (page === 'account.html') {
        initAccount();
    } else if (page === 'transfer.html') {
        initTransfer();
    } else if (page === 'transactions.html') {
        initTransactions();
    } else if (page === 'statement.html') {
        initStatement();
    }
});

// Login Logic
const initLogin = () => {
    const form = document.getElementById('loginForm');
    const togglePwd = document.getElementById('togglePassword');
    const pwdInput = document.getElementById('password');

    if (togglePwd) {
        togglePwd.addEventListener('click', () => {
            const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pwdInput.setAttribute('type', type);
            togglePwd.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const errorMsg = document.getElementById('loginError');
            
            if (username.trim() === '') {
                errorMsg.style.display = 'block';
                errorMsg.innerText = 'Username is required';
            } else if (pwdInput.value.trim() === '') {
                errorMsg.style.display = 'block';
                errorMsg.innerText = 'Password is required';
            } else if (username.trim() !== 'admin' || pwdInput.value.trim() !== '12345') {
                errorMsg.style.display = 'block';
                errorMsg.innerText = 'Invalid username or password';
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }
};

// Dashboard Logic
const initDashboard = () => {
    const user = JSON.parse(localStorage.getItem('bank_user'));
    if (!user) return;

    document.getElementById('welcomeName').innerText = user.name;
    
    const dashSelect = document.getElementById('dashboardAccountSelect');
    if (dashSelect) {
        dashSelect.innerHTML = '';
        user.accounts.forEach((acc, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.text = `${acc.accountNumber} - ${acc.accountType}`;
            dashSelect.appendChild(opt);
        });

        const updateDashboardCards = () => {
            const selectedIdx = dashSelect.value;
            const selectedAcc = user.accounts[selectedIdx];
            if (selectedAcc) {
                document.getElementById('availBalance').innerText = formatCurrency(selectedAcc.balance);
                document.getElementById('accNumber').innerText = selectedAcc.accountNumber.replace(/.(?=.{4})/g, 'x');
                document.getElementById('accType').innerText = selectedAcc.accountType;
            }
        };

        dashSelect.addEventListener('change', updateDashboardCards);
        
        if (user.accounts.length > 0) {
            updateDashboardCards();
        }
    }

    const txns = JSON.parse(localStorage.getItem('bank_transactions'));
    const tbody = document.getElementById('recentTxnBody');
    if (tbody) {
        tbody.innerHTML = '';
        txns.slice(0, 5).forEach(t => {
            const row = `<tr>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.type}</td>
                <td class="amount ${t.type.toLowerCase()}">${t.type === 'Credit' ? '+' : '-'}${formatCurrency(t.amount)}</td>
                <td><span class="status ${t.status.toLowerCase()}">${t.status}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
};

// Account Logic
const initAccount = () => {
    const user = JSON.parse(localStorage.getItem('bank_user'));
    if (!user) return;

    const populateFields = () => {
        document.getElementById('accName').innerText = user.name;
        document.getElementById('accId').innerText = user.id;
        document.getElementById('accMobile').innerText = user.mobile;
        document.getElementById('accEmail').innerText = user.email;
        document.getElementById('accAddress').innerText = user.address;
        
        // Render Multiple Accounts
        const accContainer = document.getElementById('bAccContainer');
        if (accContainer) {
            accContainer.innerHTML = '';
            user.accounts.forEach((acc, index) => {
                const accHtml = `
                    <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <h4 style="color: var(--primary-color); margin-bottom: 15px;">Account #${index + 1}</h4>
                        <div class="grid-2">
                            <div><p style="color: var(--text-light); font-size: 14px;">Account Number</p><p style="font-weight: 500;">${acc.accountNumber}</p></div>
                            <div><p style="color: var(--text-light); font-size: 14px;">Account Type</p><p style="font-weight: 500;">${acc.accountType}</p></div>
                            <div><p style="color: var(--text-light); font-size: 14px;">IFSC Code</p><p style="font-weight: 500;">${acc.ifsc}</p></div>
                            <div><p style="color: var(--text-light); font-size: 14px;">Current Balance</p><p style="font-weight: 700; color: var(--primary-color);">${formatCurrency(acc.balance)}</p></div>
                            <div><p style="color: var(--text-light); font-size: 14px;">Account Status</p><div style="margin-top: 5px;"><span class="status success">${acc.status}</span></div></div>
                        </div>
                    </div>
                `;
                accContainer.innerHTML += accHtml;
            });
        }
    };

    populateFields();

    document.getElementById('editProfileBtn').addEventListener('click', () => {
        const newName = prompt('Enter new name:', user.name);
        if (newName) {
            const newEmail = prompt('Enter new email:', user.email);
            if (newEmail) {
                const newMobile = prompt('Enter new mobile number:', user.mobile);
                if (newMobile) {
                    user.name = newName;
                    user.email = newEmail;
                    user.mobile = newMobile;
                    localStorage.setItem('bank_user', JSON.stringify(user));
                    populateFields();
                    renderHeader(); // update header name
                    showToast('Profile updated successfully!');
                }
            }
        }
    });

    const addAccBtn = document.getElementById('addAccountBtn');
    if (addAccBtn) {
        addAccBtn.addEventListener('click', () => {
            const accType = prompt("Enter Account Type (e.g., Current Account, Salary Account):", "Current Account");
            if (accType) {
                const newAccNum = "456" + Math.floor(Math.random() * 900000000 + 100000000);
                const newAcc = {
                    accountNumber: newAccNum,
                    accountType: accType,
                    ifsc: "SHAK000" + Math.floor(Math.random() * 9000 + 1000),
                    branch: "New Branch",
                    openingDate: new Date().toISOString().split('T')[0],
                    balance: Math.random() * 50000,
                    status: "Active"
                };
                user.accounts.push(newAcc);
                localStorage.setItem('bank_user', JSON.stringify(user));
                populateFields();
                showToast('New account added successfully!');
            }
        });
    }
};

// Transfer Logic
const initTransfer = () => {
    const user = JSON.parse(localStorage.getItem('bank_user'));
    const form = document.getElementById('transferForm');
    const modal = document.getElementById('confirmModal');
    
    // Populate From Account Dropdown
    const fromAccSelect = document.getElementById('fromAccountSelect');
    if (fromAccSelect && user) {
        fromAccSelect.innerHTML = '';
        user.accounts.forEach(acc => {
            const opt = document.createElement('option');
            opt.value = acc.accountNumber;
            opt.text = `${acc.accountNumber} - ${acc.accountType} (${formatCurrency(acc.balance)})`;
            fromAccSelect.appendChild(opt);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedAccNum = fromAccSelect.value;
            const bAcc = document.getElementById('bAcc').value;
            const cAcc = document.getElementById('cAcc').value;
            const amount = document.getElementById('tAmount').value;

            if (bAcc !== cAcc) {
                showToast('Account numbers do not match!', 'error');
                return;
            }
            if (amount <= 0) {
                showToast('Enter a valid amount!', 'error');
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('bank_user'));
            const accIndex = currentUser.accounts.findIndex(a => a.accountNumber === selectedAccNum);
            
            if (accIndex === -1) return;

            if (amount > currentUser.accounts[accIndex].balance) {
                showToast('Insufficient balance in selected account!', 'error');
                return;
            }

            // Show Modal
            document.getElementById('mBenName').innerText = document.getElementById('bName').value;
            document.getElementById('mAccNum').innerText = bAcc;
            document.getElementById('mAmount').innerText = formatCurrency(amount);
            
            // Store selected account in modal for confirmation step
            modal.setAttribute('data-selected-acc', selectedAccNum);
            modal.classList.add('active');
        });

        document.getElementById('cancelTransfer').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        document.getElementById('confirmTransfer').addEventListener('click', () => {
            modal.classList.remove('active');
            
            const selectedAccNum = modal.getAttribute('data-selected-acc');
            const amount = parseFloat(document.getElementById('tAmount').value);
            
            const currentUser = JSON.parse(localStorage.getItem('bank_user'));
            const txns = JSON.parse(localStorage.getItem('bank_transactions'));

            const accIndex = currentUser.accounts.findIndex(a => a.accountNumber === selectedAccNum);
            
            if (accIndex !== -1) {
                currentUser.accounts[accIndex].balance -= amount;
                localStorage.setItem('bank_user', JSON.stringify(currentUser));

                const newTxn = {
                    id: "TXN" + Math.floor(Math.random() * 9000 + 1000),
                    date: new Date().toISOString().split('T')[0],
                    description: "Transfer to " + document.getElementById('bName').value,
                    type: "Debit",
                    amount: amount,
                    status: "Success"
                };

                txns.unshift(newTxn);
                localStorage.setItem('bank_transactions', JSON.stringify(txns));

                showToast('Transfer Successful!');
                form.reset();
                
                // Refresh dropdown balances
                initTransfer();
            }
        });
    }
};

// Transactions Logic
const initTransactions = () => {
    const txns = JSON.parse(localStorage.getItem('bank_transactions'));
    const tbody = document.getElementById('txnsBody');
    
    const renderTable = (data) => {
        tbody.innerHTML = '';
        data.forEach(t => {
            const row = `<tr>
                <td>${t.id}</td>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.type}</td>
                <td class="amount ${t.type.toLowerCase()}">${t.type === 'Credit' ? '+' : '-'}${formatCurrency(t.amount)}</td>
                <td><span class="status ${t.status.toLowerCase()}">${t.status}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    };

    renderTable(txns);

    document.getElementById('filterBtn').addEventListener('click', () => {
        const search = document.getElementById('searchTxn').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filtered = txns.filter(t => {
            const mSearch = t.description.toLowerCase().includes(search) || t.id.toLowerCase().includes(search);
            const mType = typeFilter === 'All' || t.type === typeFilter;
            const mStatus = statusFilter === 'All' || t.status === statusFilter;
            return mSearch && mType && mStatus;
        });

        renderTable(filtered);
    });
};

// Statement Logic
const initStatement = () => {
    const user = JSON.parse(localStorage.getItem('bank_user'));
    
    // Populate Select Account Dropdown
    const stmtAccSelect = document.getElementById('stmtAccountSelect');
    if (stmtAccSelect && user) {
        stmtAccSelect.innerHTML = '';
        user.accounts.forEach(acc => {
            const opt = document.createElement('option');
            opt.value = acc.accountNumber;
            opt.text = `${acc.accountNumber} - ${acc.accountType}`;
            stmtAccSelect.appendChild(opt);
        });
    }


    document.getElementById('generateBtn').addEventListener('click', () => {
        const fDate = document.getElementById('sFromDate').value;
        const tDate = document.getElementById('sToDate').value;
        const selectedAccNum = stmtAccSelect ? stmtAccSelect.value : '';
        
        if(!fDate || !tDate) {
            showToast('Please select date range', 'error');
            return;
        }

        const txns = JSON.parse(localStorage.getItem('bank_transactions'));
        const tbody = document.getElementById('statementBody');
        tbody.innerHTML = '';
        
        const filtered = txns.filter(t => t.date >= fDate && t.date <= tDate);
        
        filtered.forEach(t => {
             const row = `<tr>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.id}</td>
                <td class="amount credit">${t.type === 'Credit' ? formatCurrency(t.amount) : '-'}</td>
                <td class="amount debit">${t.type === 'Debit' ? formatCurrency(t.amount) : '-'}</td>
                <td>${formatCurrency(Math.random() * 10000 + 10000)}</td> 
            </tr>`;
            tbody.innerHTML += row;
        });

        if (document.getElementById('stmtAccInfo')) {
            document.getElementById('stmtAccInfo').innerText = `Account: ${selectedAccNum} | Name: ${user.name}`;
        }
        document.getElementById('statementResult').style.display = 'block';
    });

    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });
};
