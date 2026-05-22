import { useState } from "react";
import axios from "axios";

function EmployeeTable({ color, employees }) {
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({

        employee_id: "",
        first_name: "",
        email: "",
        password: "",
        phone: "",
        department: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });
    };


    const addEmployee = async () => {

        try {

            const response = await axios.post(

                "http://localhost:5000/api/employees/add",

                formData
            );

            console.log(response.data);

            alert("Employee Added Successfully");

            window.location.reload();

        } catch (error) {

            console.log(error);

            alert("Error adding employee");
        }
    };


    // const employees = [

    //     {
    //         id: "EMP101",
    //         name: "John Doe",
    //         email: "john@gmail.com",
    //         phone: "9876543210",
    //         department: "UI/UX",
    //         status: "Active"
    //     },

    //     {
    //         id: "EMP102",
    //         name: "Sarah Smith",
    //         email: "sarah@gmail.com",
    //         phone: "9876541230",
    //         department: "Frontend",
    //         status: "Active"
    //     },

    //     {
    //         id: "EMP103",
    //         name: "David Miller",
    //         email: "david@gmail.com",
    //         phone: "9876509876",
    //         department: "Backend",
    //         status: "Inactive"
    //     }

    // ];

    const focusRing = color === "blue" ? "focus:ring-blue-500" : "focus:ring-purple-500";
    const btnBg = color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700";
    const theadBg = color === "blue" ? "bg-blue-600" : "bg-purple-600";

    return (

        <div className="p-8">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <input
                    type="text"
                    placeholder="Search Employee..."
                    className={`w-[320px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 ${focusRing}`}
                />



                <button
                    onClick={() => setShowModal(true)}
                    className={`${btnBg} text-white px-6 py-3 rounded-xl font-semibold duration-300 shadow-lg`}>
                    + Add Employee

                </button>

            </div>



            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Sl.No</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Employee ID</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Name</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Email</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Phone</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Department</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition last:border-none">
                                <td className="py-4 px-6 text-sm text-slate-500 font-medium">{index + 1}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{employee.employee_id}</td>
                                <td className="py-4 px-6 text-sm font-bold text-slate-800">{employee.first_name}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{employee.email}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{employee.phone}</td>
                                <td className="py-4 px-6 text-sm font-medium text-slate-600">{employee.department}</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center gap-2">
                                        <button className={`${btnBg} text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm`}>Edit</button>
                                        <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden flex flex-col gap-4 bg-slate-50/50 p-2 -mx-4 lg:mx-0">
                {employees.map((employee, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">

                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-${color === 'blue' ? 'blue' : 'purple'}-100 text-${color === 'blue' ? 'blue' : 'purple'}-600 flex justify-center items-center font-bold text-sm`}>
                                    {employee.first_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{employee.first_name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{employee.employee_id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Department</span>
                                <span className="font-medium text-slate-700">{employee.department}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Phone</span>
                                <span className="font-medium text-slate-700">{employee.phone}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Email</span>
                                <span className="font-medium text-slate-700 truncate block">{employee.email}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                            <button className={`${btnBg} text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm w-full md:w-auto`}>Edit</button>
                            <button className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition w-full md:w-auto">Delete</button>
                        </div>

                    </div>
                ))}
            </div>
            {
                showModal && (

                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

                        <div className="bg-white w-full max-w-lg rounded-2xl p-6">

                            <h2 className="text-2xl font-bold mb-5">
                                Add Employee
                            </h2>

                            <div className="grid gap-4">

                                <input
                                    type="text"
                                    name="employee_id"
                                    placeholder="Employee ID"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Department"
                                    onChange={handleChange}
                                    className="border p-3 rounded-xl"
                                />

                            </div>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-200 px-5 py-2 rounded-xl"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={addEmployee}
                                    className={`${btnBg} text-white px-5 py-2 rounded-xl`}
                                >
                                    Add
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }
        </div>

    );

}

export default EmployeeTable;