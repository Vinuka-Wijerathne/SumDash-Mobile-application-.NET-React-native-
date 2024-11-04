<h1>SumDash: A React Native Game Application</h1>

<p><strong>SumDash</strong> is an engaging game application built with React Native using Expo, leveraging a .NET backend connected to a MongoDB database and the Banana API for dynamic question fetching. Players answer questions within a time limit to score points, all while enjoying a user-friendly interface that supports light and dark modes.</p>

<h2>Table of Contents</h2>
<ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#technologies-used">Technologies Used</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#backend-architecture">Backend Architecture</a></li>
    <li><a href="#game-functionality">Game Functionality</a></li>
    <li><a href="#theme-context">Theme Context</a></li>
    <li><a href="#api-integration">API Integration</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
</ul>

<h2>Features</h2>
<ul>
    <li><strong>Dynamic Question Fetching</strong>: Questions are fetched from the Banana API, providing varied gameplay.</li>
    <li><strong>Time-Dependent Scoring</strong>: Players have a limited time to answer questions, enhancing the challenge.</li>
    <li><strong>User-Friendly Interface</strong>: Clear visuals with intuitive navigation.</li>
    <li><strong>Light and Dark Mode Support</strong>: Users can switch between themes for a personalized experience.</li>
    <li><strong>Score Tracking</strong>: Displays current score and time remaining.</li>
    <li><strong>Backend Data Management</strong>: User scores and game history are managed through a .NET backend with MongoDB.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
    <li><strong>Frontend</strong>: React Native, Expo, Axios</li>
    <li><strong>Backend</strong>: .NET Core Web API</li>
    <li><strong>Database</strong>: MongoDB</li>
    <li><strong>State Management</strong>: React hooks for managing game state</li>
    <li><strong>Styling</strong>: Custom styles for light and dark modes using React Native StyleSheet</li>
    <li><strong>Theme Context</strong>: Context API for managing user themes</li>
</ul>

<h2>Installation</h2>
<ol>
    <li><strong>Clone the repository</strong>:</li>
</ol>
<pre><code>git clone &lt;repository-url&gt;
cd sumdash</code></pre>
<ol start="2">
    <li><strong>Install frontend dependencies</strong>:</li>
</ol>
<pre><code>npm install</code></pre>
<ol start="3">
    <li><strong>Run the frontend application</strong>:</li>
</ol>
<pre><code>npm start</code></pre>
<p>You can then run the app on a simulator or your mobile device using the Expo Go app.</p>

<ol start="4">
    <li><strong>Setup the backend</strong>:</li>
</ol>
<p>Ensure that you have .NET SDK installed. Follow these steps to set up the backend:</p>
<ul>
    <li>Navigate to the backend directory:</li>
</ul>
<pre><code>cd backend</code></pre>
<ul>
    <li>Restore the .NET dependencies:</li>
</ul>
<pre><code>dotnet restore</code></pre>
<ul>
    <li>Run the backend server:</li>
</ul>
<pre><code>dotnet run</code></pre>
<p>Ensure that the MongoDB service is running and properly configured to connect with the backend.</p>

<h2>Backend Architecture</h2>
<p>The SumDash application utilizes a .NET Core Web API for the backend, which connects to a MongoDB database for persistent storage of user scores and game history. The backend handles the following:</p>
<ul>
    <li><strong>User Data Management</strong>: Storing and retrieving user scores and statistics.</li>
    <li><strong>Game Configuration</strong>: Managing game settings and retrieving game-related data.</li>
    <li><strong>API Endpoints</strong>: Exposing endpoints for the React Native frontend to interact with the database and perform CRUD operations.</li>
</ul>

<h3>MongoDB Integration</h3>
<p>The application uses MongoDB for data storage. Key collections include:</p>
<ul>
    <li><strong>Users</strong>: Stores user information and scores.</li>
    <li><strong>Game History</strong>: Tracks gameplay sessions and performance metrics.</li>
</ul>
<p>Ensure your MongoDB connection string is configured in the <code>appsettings.json</code> file in the backend project.</p>

<h2>Game Functionality</h2>

<h3>Overview</h3>
<p>The game operates as follows:</p>
<ul>
    <li>A question image is displayed, and players must input their answer before the timer runs out.</li>
    <li>Players earn points for correct answers and receive a new question immediately.</li>
    <li>If the timer reaches zero, the game ends, and the player's score is displayed.</li>
</ul>

<h3>Code Snippet</h3>
<p>Here’s a brief overview of how the main game functionality is implemented:</p>
<pre><code>const GamePage = ({ route, navigation }) => {
  const { timeLimit } = route.params; // Retrieve time limit from navigation params
  const { isDarkMode } = useTheme(); // Get the theme state
  const [questionImage, setQuestionImage] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    fetchQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert('Game Over', `Your score is ${score}`);
      navigation.navigate('Dashboard'); // Navigate to the dashboard on game over
    }
  }, [timeLeft]);
  
  // Fetch question and handle answer submission functions...
};</code></pre>

<h2>Theme Context</h2>
<p>The application supports light and dark modes through a <code>ThemeContext</code>, allowing users to toggle themes easily.</p>
<pre><code>const { isDarkMode } = useTheme();</code></pre>

<h2>API Integration</h2>
<p>The game fetches questions and answers from the Banana API using Axios. Here’s an example of how the API is integrated:</p>
<pre><code>const fetchQuestion = async () => {
  try {
    const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
    setQuestionImage(response.data.question); // Set image URL for the question
    setSolution(response.data.solution); // Set solution for validation
  } catch (error) {
    console.error(error);
  }
};</code></pre>

<h2>Usage</h2>
<p>After running the application:</p>
<ol>
    <li>Navigate to the game screen.</li>
    <li>Answer the questions before the timer runs out.</li>
    <li>Watch your score increase as you answer correctly!</li>
    <li>Use the back button to return to the previous screen.</li>
</ol>

<h2>Contributing</h2>
<p>Contributions are welcome! If you have ideas for features or improvements, feel free to fork the repository and submit a pull request.</p>

<h2>License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for details.</p>
