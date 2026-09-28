interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <nav className="flex items-center gap-10" aria-label="Paginação">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage -1)}
            >
                Anterior
            </button>

            <span>
                Página {currentPage} de {lastPage}
            </span>

            <button
                disabled={currentPage === lastPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Próxima
            </button>
        </nav>
    );
}