import hbs from 'hbs'
hbs.registerHelper('pagination', function(currentPage, totalPages, options) {
    currentPage = currentPage || 1;
    currentPage = Number.parseInt(currentPage);
    totalPages = Number.parseInt(totalPages);

    let pages;
    const allPages = [];
    for (let i = 1; i <= totalPages; i++) {
        allPages.push({ page: i, isCurrent: i === currentPage, disabled: false });
    }
    if (currentPage > 5) {
        pages = allPages.slice(currentPage - 3, currentPage);
        pages.unshift({ page: '...', disabled: true })
        pages.unshift({ page: 1 });
    } else {
        pages = allPages.slice(0, currentPage);
    }

    if (currentPage < totalPages - 4) {
        pages.push(...allPages.slice(currentPage, currentPage + 2));
        pages.push({ page: '...', disabled: true })
        pages.push({ page: totalPages });
    } else {
        pages.push(...allPages.slice(currentPage, totalPages));
    }

    const context = {
        firstPage: currentPage === 1,
        pages: pages,
        total: totalPages,
        currentPage: currentPage,
        lastPage: currentPage === totalPages,
    };
    return options.fn(context);
});

export default hbs;