#include <iostream>
#include <vector>
#include <cmath>
#include <thread>
#include <coroutine>
#include <mutex>

// A generator class for producing narcissistic numbers
template <typename T>
class Generator
{
public:
  struct promise_type
  {
    T current_value;

    Generator get_return_object()
    {
      return Generator{
          std::coroutine_handle<promise_type>::from_promise(*this)};
    }
    std::suspend_always initial_suspend() { return {}; }
    std::suspend_always final_suspend() noexcept { return {}; }
    std::suspend_always yield_value(T value)
    {
      current_value = value;
      return {};
    }
    void return_void() {}
    void unhandled_exception() { std::terminate(); }
  };

  using handle_type = std::coroutine_handle<promise_type>;

  explicit Generator(handle_type handle) : coro_handle(handle) {}
  ~Generator()
  {
    if (coro_handle)
      coro_handle.destroy();
  }

  T next()
  {
    if (coro_handle && !coro_handle.done())
    {
      coro_handle.resume();
      return coro_handle.promise().current_value;
    }
    return T{};
  }

  explicit operator bool() const
  {
    return coro_handle && !coro_handle.done();
  }

private:
  handle_type coro_handle;
};

// A coroutine to generate narcissistic numbers for a specific range
Generator<int> find_narcissistic_numbers(int power, unsigned long long int start, unsigned long long int end)
{
  unsigned long long int cache[10];
  std::cout << "calculating powers cache\n";
  for (int i = 0; i < 10; i++)
  {
    cache[i] = pow(i, power);
  }

  for (unsigned long long int num = start; num <= end; ++num)
  {
    int sum = 0;
    int temp = num;
    while (temp > 0)
    {
      int digit = temp % 10;
      sum += cache[digit];
      temp /= 10;
    }
    if (sum == num)
    {
      co_yield num;
    }
  }
}

// Thread-safe output
std::mutex output_mutex;

void process_range(int power, unsigned long long int start, unsigned long long int end, std::vector<int> &results)
{

  auto narcissistic_gen = find_narcissistic_numbers(power, start, end);
  while (narcissistic_gen)
  {
    int value = narcissistic_gen.next();
    std::lock_guard<std::mutex> lock(output_mutex);
    results.push_back(value);
  }
}

unsigned long long int upper_bound(int p)
{
  int d = 2;
  unsigned long long int nine_to_p = pow(9, p);
  unsigned long long int max_n_digit = 100;
  while (max_n_digit - 1 < nine_to_p * d)
  {
    max_n_digit *= 10;
    d++;
  }
  return nine_to_p * d;
}

int main(int argc, char *argv[])
{
  int num_threads = 8; // Number of threads to use

  int power = 5;

  if (argc > 1)
  {
    power = std::stoi(argv[1]);
  }
  unsigned long long int max_limit = upper_bound(power); // Define the upper range
  std::cout << "the upper bound is: " << max_limit << "\n";
  int chunk_size = max_limit / num_threads;

  std::vector<std::thread> threads;
  std::vector<int> results;

  // Divide the work into chunks and launch threads
  for (int i = 0; i < num_threads; ++i)
  {
    unsigned long long int start = i * chunk_size + 1;
    unsigned long long int end = (i == num_threads - 1) ? max_limit : (i + 1) * chunk_size;

    threads.emplace_back(process_range, power, start, end, std::ref(results));
  }

  // Wait for all threads to finish
  for (auto &thread : threads)
  {
    thread.join();
  }

  // Sort and display results
  // std::sort(results.begin(), results.end());
  std::cout << "Narcissistic numbers (power " << power << "):\n";
  for (int num : results)
  {
    std::cout << num << " ";
  }
  std::cout << "\n";

  return 0;
}