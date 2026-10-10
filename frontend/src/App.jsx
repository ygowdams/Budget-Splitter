import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {

    // =====================================================
    // STATES
    // =====================================================

    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const [tripName, setTripName] = useState("");
    const [destination, setDestination] = useState("");
    const [budget, setBudget] = useState("");

    const [memberInputs, setMemberInputs] = useState({});
    const [expenseInputs, setExpenseInputs] = useState({});


    // =====================================================
    // FETCH TRIPS
    // =====================================================

    const fetchTrips = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/trips`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setTrips(data);

        } catch (error) {

            console.error("Error fetching trips:", error);

        }

    };


    // =====================================================
    // FETCH EXPENSES
    // =====================================================

    const fetchExpenses = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/expenses`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setExpenses(data);

        } catch (error) {

            console.error("Error fetching expenses:", error);

        }

    };


    // =====================================================
    // REFRESH DATA
    // =====================================================

    const refreshData = () => {

        fetchTrips();
        fetchExpenses();

    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        refreshData();

        const interval = setInterval(
            refreshData,
            5000
        );

        return () => clearInterval(interval);

    }, []);


    // =====================================================
    // CREATE TRIP
    // =====================================================

    const createTrip = async (e) => {

        e.preventDefault();


        if (
            !tripName.trim() ||
            !destination.trim() ||
            !budget
        ) {

            alert(
                "Please enter trip name, destination and budget."
            );

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/api/trips`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: tripName.trim(),
                        destination: destination.trim(),
                        budget: Number(budget),
                        members: []
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not create trip."
                );

                return;

            }


            // Clear form
            setTripName("");
            setDestination("");
            setBudget("");


            // Refresh trips
            fetchTrips();


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend."
            );

        }

    };


    // =====================================================
    // ADD MEMBER
    // =====================================================

    const addMember = async (tripId) => {

    const name = (
        memberInputs[tripId] || ""
    ).trim();

    if (!name) {
        alert("Enter a member name.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/trips/${tripId}/members`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Could not add member.");
            return;
        }

        setMemberInputs((prev) => ({
            ...prev,
            [tripId]: ""
        }));

        fetchTrips();

    } catch (error) {

        console.error("Add member error:", error);

        alert("Could not connect to the backend.");
    }
};

    // =====================================================
    // REMOVE MEMBER
    // =====================================================

    const removeMember = async (
        tripId,
        memberName
    ) => {

        if (
            !window.confirm(
                `Remove ${memberName}?`
            )
        ) {

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/api/trips/${tripId}/members/${encodeURIComponent(memberName)}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not remove member."
                );

                return;

            }


            fetchTrips();


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend."
            );

        }

    };


    // =====================================================
    // ADD EXPENSE
    // =====================================================

    const addExpense = async (tripId) => {

        const input =
            expenseInputs[tripId] || {};


        const description =
            (input.description || "").trim();


        const amount =
            Number(input.amount);


        const paidBy =
            (input.paidBy || "").trim();


        if (
            !description ||
            !amount ||
            !paidBy
        ) {

            alert(
                "Fill description, amount and paid by."
            );

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/api/expenses`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        tripId,

                        description,

                        amount,

                        paidBy

                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not add expense."
                );

                return;

            }


            setExpenseInputs((prev) => ({

                ...prev,

                [tripId]: {
                    description: "",
                    amount: "",
                    paidBy: ""
                }

            }));


            fetchExpenses();


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend."
            );

        }

    };


    // =====================================================
    // DELETE TRIP
    // =====================================================

    const deleteTrip = async (id) => {

        if (
            !window.confirm(
                "Delete this trip and its expenses?"
            )
        ) {

            return;

        }


        try {

            const response = await fetch(
                `${API_URL}/api/trips/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not delete trip."
                );

                return;

            }


            refreshData();


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend."
            );

        }

    };


    // =====================================================
    // GET TRIP EXPENSES
    // =====================================================

    const getTripExpenses = (tripId) => {

        return expenses.filter(
            (expense) =>
                String(expense.tripId) ===
                String(tripId)
        );

    };


    // =====================================================
    // GET TOTAL FOR TRIP
    // =====================================================

    const getTotal = (tripId) => {

        return getTripExpenses(tripId)
            .reduce(
                (sum, expense) =>
                    sum + Number(expense.amount),
                0
            );

    };


    // =====================================================
    // TOTAL SPENT
    // =====================================================

    const totalSpent = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount),
        0
    );


    // =====================================================
    // TOTAL MEMBERS
    // =====================================================

    const totalMembers = trips.reduce(
        (sum, trip) =>
            sum + trip.members.length,
        0
    );


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="app">


            {/* HEADER */}

            <header className="header">

                <div>

                    <h1>✈️ TripSplit</h1>

                    <p>
                        Travel & Expense Management
                    </p>

                </div>


                <button
                    className="refresh-btn"
                    onClick={refreshData}
                >
                    🔄 Refresh Data
                </button>

            </header>



            {/* SUMMARY */}

            <section className="summary">

                <div>

                    <span>Trips</span>

                    <strong>
                        {trips.length}
                    </strong>

                </div>


                <div>

                    <span>Total Spent</span>

                    <strong>
                        ₹{totalSpent.toLocaleString()}
                    </strong>

                </div>


                <div>

                    <span>Members</span>

                    <strong>
                        {totalMembers}
                    </strong>

                </div>

            </section>



            {/* CREATE TRIP */}

            <section className="create-section">

                <h2>
                    Create New Trip
                </h2>


                <form onSubmit={createTrip}>

                    <input
                        type="text"
                        placeholder="Trip name"
                        value={tripName}
                        onChange={(e) =>
                            setTripName(
                                e.target.value
                            )
                        }
                    />


                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) =>
                            setDestination(
                                e.target.value
                            )
                        }
                    />


                    <input
                        type="number"
                        placeholder="Budget"
                        value={budget}
                        min="0"
                        onChange={(e) =>
                            setBudget(
                                e.target.value
                            )
                        }
                    />


                    <button type="submit">
                        + Create Trip
                    </button>

                </form>

            </section>



            {/* TRIPS */}

            <section className="trips-section">


                <div className="section-title">

                    <h2>
                        Your Trips
                    </h2>

                    <span>
                        {trips.length} trip(s)
                    </span>

                </div>



                {trips.length === 0 ? (

                    <div className="empty-card">
                        No trips available.
                    </div>

                ) : (

                    <div className="trip-grid">


                        {trips.map((trip) => {

                            const tripId =
                                trip._id;


                            const tripExpenses =
                                getTripExpenses(
                                    tripId
                                );


                            const memberInput =
                                memberInputs[
                                    tripId
                                ] || "";


                            const expenseInput =
                                expenseInputs[
                                    tripId
                                ] || {
                                    description: "",
                                    amount: "",
                                    paidBy: ""
                                };


                            return (

                                <div
                                    className="trip-card"
                                    key={tripId}
                                >


                                    {/* TRIP HEADER */}

                                    <div className="trip-top">

                                        <div>

                                            <h3>
                                                {trip.name}
                                            </h3>

                                            <p>
                                                📍 {trip.destination}
                                            </p>

                                            <p>
                                                💰 Budget: ₹
                                                {Number(
                                                    trip.budget
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteTrip(
                                                    tripId
                                                )
                                            }
                                        >
                                            🗑
                                        </button>

                                    </div>



                                    {/* MEMBERS */}

                                    <div className="members">

                                        <h4>
                                            👥 Members
                                        </h4>


                                        {trip.members.length === 0 ? (

                                            <p className="empty">
                                                No members yet.
                                            </p>

                                        ) : (

                                            <div className="member-list">

                                                {trip.members.map(
                                                    (
                                                        member,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={index}
                                                        >

                                                            {member}


                                                            <button
                                                                onClick={() =>
                                                                    removeMember(
                                                                        tripId,
                                                                        member
                                                                    )
                                                                }
                                                                title="Remove member"
                                                            >
                                                                ×
                                                            </button>

                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>



                                    {/* ADD MEMBER */}

                                    <div className="add-member">

                                        <input
                                            type="text"
                                            placeholder="Add person"
                                            value={memberInput}
                                            onChange={(e) =>
                                                setMemberInputs(
                                                    (prev) => ({
                                                        ...prev,
                                                        [tripId]:
                                                            e.target.value
                                                    })
                                                )
                                            }
                                            onKeyDown={(e) => {

                                                if (
                                                    e.key ===
                                                    "Enter"
                                                ) {

                                                    e.preventDefault();

                                                    addMember(
                                                        tripId
                                                    );

                                                }

                                            }}
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                addMember(
                                                    tripId
                                                )
                                            }
                                        >
                                            Add
                                        </button>

                                    </div>



                                    {/* EXPENSES */}

                                    <div className="trip-expenses">

                                        <h4>
                                            💰 Expenses
                                        </h4>


                                        {tripExpenses.length === 0 ? (

                                            <p className="empty">
                                                No expenses yet.
                                            </p>

                                        ) : (

                                            tripExpenses.map(
                                                (expense) => (

                                                    <div
                                                        className="expense-row"
                                                        key={
                                                            expense._id
                                                        }
                                                    >

                                                        <div>

                                                            <strong>
                                                                {
                                                                    expense.description
                                                                }
                                                            </strong>

                                                            <small>
                                                                Paid by{" "}
                                                                {
                                                                    expense.paidBy
                                                                }
                                                            </small>

                                                        </div>


                                                        <b>
                                                            ₹
                                                            {Number(
                                                                expense.amount
                                                            ).toLocaleString()}
                                                        </b>

                                                    </div>

                                                )
                                            )

                                        )}



                                        <div className="total">

                                            Total Spent: ₹
                                            {getTotal(
                                                tripId
                                            ).toLocaleString()}

                                        </div>

                                    </div>



                                    {/* ADD EXPENSE */}

                                    <div className="add-expense">

                                        <h4>
                                            Add Expense
                                        </h4>


                                        <input
                                            placeholder="Description"
                                            value={
                                                expenseInput.description
                                            }
                                            onChange={(e) =>
                                                setExpenseInputs(
                                                    (prev) => ({
                                                        ...prev,

                                                        [tripId]: {
                                                            ...expenseInput,

                                                            description:
                                                                e.target.value
                                                        }
                                                    })
                                                )
                                            }
                                        />


                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            min="0"
                                            value={
                                                expenseInput.amount
                                            }
                                            onChange={(e) =>
                                                setExpenseInputs(
                                                    (prev) => ({
                                                        ...prev,

                                                        [tripId]: {
                                                            ...expenseInput,

                                                            amount:
                                                                e.target.value
                                                        }
                                                    })
                                                )
                                            }
                                        />


                                        <select
                                            value={
                                                expenseInput.paidBy
                                            }
                                            onChange={(e) =>
                                                setExpenseInputs(
                                                    (prev) => ({
                                                        ...prev,

                                                        [tripId]: {
                                                            ...expenseInput,

                                                            paidBy:
                                                                e.target.value
                                                        }
                                                    })
                                                )
                                            }
                                        >

                                            <option value="">
                                                Paid by
                                            </option>


                                            {trip.members.map(
                                                (
                                                    member,
                                                    index
                                                ) => (

                                                    <option
                                                        key={index}
                                                        value={member}
                                                    >
                                                        {member}
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                addExpense(
                                                    tripId
                                                )
                                            }
                                        >
                                            Add Expense
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </section>

        </div>

    );

}

export default App;