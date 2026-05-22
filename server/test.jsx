const onSubmit = async (data) => {

    try {

        const response = await axios.post(

            "http://localhost:5000/api/users/register",

            {
                name: "Super Admin",
                email: data.email,
                password: data.password,
                role: "superadmin"
            }

        );



        alert(response.data.message);

        navigate("/super-admin-dashboard");

    }

    catch (error) {

        alert(error.response.data.message);

    }

};


// Hello 