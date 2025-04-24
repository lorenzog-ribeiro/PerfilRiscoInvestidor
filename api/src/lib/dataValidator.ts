export default function isValidDate(dateStr: string): boolean {
    const [day, month, year] = dateStr.split("/").map(Number);
    const currentYear = new Date().getFullYear();

    if (!day || !month || !year || day < 1 || month < 1 || month > 12 || year < 1900 || year > currentYear) {
        return false;
    }
    // Cria o objeto Date com mês - 1 (pois janeiro = 0)
    const date = new Date(year, month - 1, day);
    
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
