const STORAGE_KEY = "activityRegistrations";
const form = document.getElementById("registerForm");
const formMessage = document.getElementById("formMessage");
const listMessage = document.getElementById("listMessage");
const registrationList = document.getElementById("registrationList");
const total = document.getElementById("total");
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

function getRegistrations() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];

    const registrations = JSON.parse(stored);
    if (!Array.isArray(registrations) || !registrations.every((entry) =>
        entry && typeof entry.name === "string" &&
        typeof entry.email === "string" &&
        typeof entry.phone === "string")) {
        throw new Error("报名资料格式无效，请检查浏览器本地存储。");
    }
    return registrations;
}

function renderRegistrations() {
    const registrations = getRegistrations();
    total.textContent = `报名人数：${registrations.length}`;
    registrationList.replaceChildren();

    if (registrations.length === 0) {
        const empty = document.createElement("p");
        empty.className = "intro";
        empty.textContent = "目前还没有报名人员。";
        registrationList.append(empty);
        return;
    }

    registrations.forEach((registration, index) => {
        const card = document.createElement("article");
        card.className = "registration-card";

        const name = document.createElement("strong");
        name.textContent = `${index + 1}. ${registration.name}`;
        card.append(name);

        [["Gmail", registration.email], ["电话号码", registration.phone]].forEach(([label, value]) => {
            const detail = document.createElement("p");
            detail.textContent = `${label}：${value}`;
            card.append(detail);
        });

        registrationList.append(card);
    });
}

function showPage(pageNumber) {
    const showingList = pageNumber === 2;
    page1.hidden = showingList;
    page2.hidden = !showingList;

    if (showingList) {
        listMessage.textContent = "";
        listMessage.classList.remove("error");
        try {
            renderRegistrations();
        } catch (error) {
            listMessage.textContent = error instanceof SyntaxError
                ? "无法读取报名资料：浏览器本地存储中的资料格式无效。"
                : `无法读取报名资料：${error.message}`;
            listMessage.classList.add("error");
        }
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "";
    formMessage.classList.remove("error");

    const registration = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    try {
        const registrations = getRegistrations();
        registrations.push(registration);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
        form.reset();
        formMessage.textContent = "报名成功，资料已保存在此浏览器。";
    } catch (error) {
        formMessage.textContent = error instanceof SyntaxError
            ? "无法保存报名：浏览器本地存储中的现有资料格式无效。"
            : `无法保存报名：${error.message}`;
        formMessage.classList.add("error");
    }
});

document.getElementById("showList").addEventListener("click", () => showPage(2));
document.getElementById("showForm").addEventListener("click", () => showPage(1));