export const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const contractTypeOptions = [
    { value: "Kinh tế", label: "Hợp đồng Kinh tế", icon: "💼" },
    { value: "Lao động", label: "Hợp đồng Lao động", icon: "👥" },
    { value: "Dịch vụ", label: "Hợp đồng Dịch vụ", icon: "🔧" },
    { value: "Nguyên tắc", label: "Hợp đồng Nguyên tắc", icon: "📋" },
    { value: "Mua bán", label: "Hợp đồng Mua bán", icon: "🛒" },
    { value: "Thuê", label: "Hợp đồng Thuê", icon: "🏠" },
];

export const managerOptions = [
    { value: "Trần Thị B - Phòng Kinh doanh", label: "Trần Thị B", icon: "👤" },
    { value: "Lê Văn C - Phòng Pháp chế", label: "Lê Văn C", icon: "👤" },
    { value: "Phạm Thị D - Phòng Tài chính", label: "Phạm Thị D", icon: "👤" },
    { value: "Hoàng Văn E - Phòng Kinh doanh", label: "Hoàng Văn E", icon: "👤" },
];

export const generateContractCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    return `HD${year}${month}${day}${random}`;
};

export const formatVietnameseDate = (date: Date): string => {
    return date.toLocaleDateString("vi-VN");
};

export const getContractTypeDescription = (contractType: string): string => {
    const descriptions = {
        employment: "Quản lý thông tin nhân viên, vị trí công việc, mức lương và các điều khoản lao động",
        service: "Quản lý nhà cung cấp dịch vụ, phạm vi công việc, giá trị hợp đồng và điều khoản thanh toán",
        partnership: "Quản lý thông tin đối tác, loại hợp tác, phạm vi hoạt động và chia sẻ lợi ích",
        rental: "Quản lý thông tin bất động sản, giá thuê, tiền cọc và các điều khoản thuê",
        consulting: "Quản lý chuyên gia tư vấn, lĩnh vực chuyên môn, phí tư vấn và thời gian thực hiện",
        training: "Quản lý đơn vị đào tạo, chương trình học, chi phí và số lượng học viên",
        nda: "Quản lý thông tin bảo mật, các bên liên quan, thời hạn và phạm vi bảo mật",
    };
    return descriptions[contractType as keyof typeof descriptions] || "";
};
