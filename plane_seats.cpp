#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>

int main()
{
  // Create and open a file
  std::ofstream outFile("seating_reservations.txt");
  if (!outFile.is_open())
  {
    std::cerr << "Error opening file!" << std::endl;
    return 1;
  }

  // Generate data for Suites class
  for (int id = 0; id <= 5; ++id)
  {
    outFile << "A" << std::setw(3) << std::setfill('0') << id << "|2500" << std::endl;
  }

  // Generate data for Business class
  for (int id = 6; id <= 30; ++id)
  {
    outFile << "B" << std::setw(3) << std::setfill('0') << id << "|1500" << std::endl;
  }

  // Generate data for Economy class
  for (int id = 31; id <= 65; ++id)
  {
    outFile << "C" << std::setw(3) << std::setfill('0') << id << "|750" << std::endl;
  }

  // Close the file
  outFile.close();

  std::cout << "Seating reservations initialized and written to seating_reservations.txt" << std::endl;

  return 0;
}
