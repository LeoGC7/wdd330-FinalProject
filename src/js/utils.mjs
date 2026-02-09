// Templates
    // Render Template
    export function renderTemplate(template, parentElement) {
        parentElement.innerHTML = template
    }

    // Load Template
    export async function loadTemplate(path) {
        const res = await fetch(path)
        const template = await res.text()
        return template
    }

// Header and Footer logic
    // Load header and footer templates
    export async function loadHeaderandFooter() {
        const headerTemplate = await loadTemplate("/partials/header.html")
        const footerTemplate = await loadTemplate("/partials/footer.html")

        const headerElement = document.getElementById('mainHeader')
        const footerElement = document.getElementById('mainFooter')

        renderTemplate(headerTemplate, headerElement)
        renderTemplate(footerTemplate, footerElement)

        loadFooterText()
    }

    // Load footer copyright year
    export function loadFooterText() {
        const dataObject = new Date()
        const year = dataObject.getFullYear()
        const yearElement = document.getElementById('year')
        yearElement.innerText = year
    }