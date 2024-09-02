// Тип для ответа на запрос авторизации
export interface AuthResponse {
	data: {
		token: string;
	};
}

// Тип для данных таблицы
export interface TableData {
	id: string;
	companySigDate: string;
	companySignatureName: string;
	documentName: string;
	documentStatus: string;
	documentType: string;
	employeeNumber: string;
	employeeSigDate: string;
	employeeSignatureName: string;
}

// Тип для ответа сервера при получении данных таблицы
export interface FetchDataResponse {
	data: TableData[];
}

// Тип для создания или обновления записи
export interface FetchDataBody {
	companySigDate: string;
	companySignatureName: string;
	documentName: string;
	documentStatus: string;
	documentType: string;
	employeeNumber: string;
	employeeSigDate: string;
	employeeSignatureName: string;
}

// Тип для ответа сервера при добавлении или изменении записи
export interface CreateOrUpdateResponse {
	data: TableData;
	error_code?: number;
}

// Тип для ответа сервера при удалении записи
export interface DeleteResponse {
	error_code: number;
}
