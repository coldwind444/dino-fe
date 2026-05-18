// For lectures
export const saveLectureIndexToLocalStorage = (
    gradeLevel: string,
    topicId: string,
    index: number,
    diff: string,
) => {
    const key = `lecture_index_${gradeLevel}_${topicId}`;
    try {
        localStorage.setItem(key, JSON.stringify({ index, diff }));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

export const getLectureIndexFromLocalStorage = (
    gradeLevel: string,
    topicId: string,
) => {
    const key = `lecture_index_${gradeLevel}_${topicId}`;
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Error getting from localStorage:", error);
        return null;
    }
};

export const removeLectureIndexFromLocalStorage = (
    gradeLevel: string,
    topicId: string,
) => {
    const key = `lecture_index_${gradeLevel}_${topicId}`;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
};