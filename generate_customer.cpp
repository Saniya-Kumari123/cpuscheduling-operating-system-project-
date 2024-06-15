#include <iostream>
#include <fstream>
#include <iomanip>
#include <cstdlib>
#include <ctime>

int main()
{
  // Initialize random seed
  std::srand(std::time(0));

  // Create and open a file
  std::ofstream outFile("customer_data.txt");
  if (!outFile.is_open())
  {
    std::cerr << "Error opening file!" << std::endl;
    return 1;
  }

  // Generate data
  for (int id = 0; id < 200; ++id)
  {
    int bankBalance = 1000 + std::rand() % 9001; // Random number from 1000 to 10000
    int travelFrequency = std::rand() % 10;      // Random number from 0 to 99

    // Write formatted data to file
    outFile << std::setw(3) << std::setfill('0') << id << " "
            << std::setw(5) << std::setfill('0') << bankBalance << " "
            << std::setw(2) << std::setfill('0') << travelFrequency << std::endl;
  }

  // Close the file
  outFile.close();

  std::cout << "Data generated and written to customer_data.txt" << std::endl;

  return 0;
}
