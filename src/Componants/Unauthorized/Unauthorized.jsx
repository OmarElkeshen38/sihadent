export default function Unauthorized() {
    return (
        <div className="h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-black text-red-500">🚫 غير مصرح</h1>
                <p className="text-gray-500 mt-2">
                    ليس لديك صلاحية للوصول لهذه الصفحة
                </p>
            </div>
        </div>
    );
}