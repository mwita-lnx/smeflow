import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/business_provider.dart';
import '../../providers/category_provider.dart';
import '../../widgets/business_card.dart';
import '../../widgets/category_chip.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadData();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadData() {
    final categoryProvider = context.read<CategoryProvider>();
    final businessProvider = context.read<BusinessProvider>();

    categoryProvider.loadCategories();
    businessProvider.searchBusinesses();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent * 0.8) {
      final businessProvider = context.read<BusinessProvider>();
      final pagination = businessProvider.pagination;

      if (pagination != null &&
          pagination['page'] < pagination['totalPages'] &&
          !businessProvider.isLoading) {
        businessProvider.searchBusinesses(
          query: _searchController.text.isNotEmpty ? _searchController.text : null,
          category: _selectedCategory,
          page: pagination['page'] + 1,
          append: true,
        );
      }
    }
  }

  void _onSearch(String query) {
    final businessProvider = context.read<BusinessProvider>();
    businessProvider.searchBusinesses(
      query: query.isNotEmpty ? query : null,
      category: _selectedCategory,
    );
  }

  void _onCategorySelected(String? category) {
    setState(() {
      _selectedCategory = _selectedCategory == category ? null : category;
    });

    final businessProvider = context.read<BusinessProvider>();
    businessProvider.searchBusinesses(
      query: _searchController.text.isNotEmpty ? _searchController.text : null,
      category: _selectedCategory,
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: AppTheme.bgGreen,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top bar
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user != null ? 'Hello, ${user.firstName}!' : 'Welcome to SmeFlow!',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                          ),
                          Text(
                            'Discover businesses near you',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: AppTheme.textSecondary,
                                ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      if (user != null)
                        IconButton(
                          onPressed: () {
                            // TODO: Navigate to profile
                          },
                          icon: CircleAvatar(
                            backgroundColor: AppTheme.primaryGreen.withOpacity(0.1),
                            child: Text(
                              user.firstName[0].toUpperCase(),
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    color: AppTheme.primaryGreen,
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                          ),
                        )
                      else
                        TextButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/login');
                          },
                          icon: const Icon(Icons.login),
                          label: const Text('Login'),
                          style: TextButton.styleFrom(
                            foregroundColor: AppTheme.primaryGreen,
                          ),
                        ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Search bar and Products button row
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          onSubmitted: _onSearch,
                          decoration: InputDecoration(
                            hintText: 'Search businesses...',
                            prefixIcon: const Icon(Icons.search),
                            suffixIcon: _searchController.text.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear),
                                    onPressed: () {
                                      _searchController.clear();
                                      _onSearch('');
                                    },
                                  )
                                : null,
                            filled: true,
                            fillColor: AppTheme.background,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pushNamed(context, '/products');
                        },
                        icon: const Icon(Icons.shopping_bag, size: 20),
                        label: const Text('Products'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.accentOrange,
                          side: BorderSide(color: AppTheme.accentOrange, width: 2),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Categories
            Consumer<CategoryProvider>(
              builder: (context, categoryProvider, child) {
                if (categoryProvider.isLoading) {
                  return const SizedBox.shrink();
                }

                if (categoryProvider.categories.isEmpty) {
                  return const SizedBox.shrink();
                }

                return Container(
                  height: 50,
                  margin: const EdgeInsets.symmetric(vertical: 12),
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    scrollDirection: Axis.horizontal,
                    itemCount: categoryProvider.categories.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final category = categoryProvider.categories[index];
                      return CategoryChip(
                        label: category.name,
                        isSelected: _selectedCategory == category.slug,
                        onTap: () => _onCategorySelected(category.slug),
                      );
                    },
                  ),
                );
              },
            ),

            // Business list
            Expanded(
              child: Consumer<BusinessProvider>(
                builder: (context, businessProvider, child) {
                  if (businessProvider.isLoading && businessProvider.businesses.isEmpty) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (businessProvider.hasError) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.error_outline,
                            size: 64,
                            color: AppTheme.primaryRed,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Error loading businesses',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            businessProvider.error ?? 'Unknown error',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: AppTheme.textSecondary,
                                ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _loadData,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    );
                  }

                  if (businessProvider.businesses.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.store_outlined,
                            size: 64,
                            color: AppTheme.textSecondary,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No businesses found',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try adjusting your search or filters',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: AppTheme.textSecondary,
                                ),
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: () async => _loadData(),
                    child: GridView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(20),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.75,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: businessProvider.businesses.length +
                          (businessProvider.isLoading ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == businessProvider.businesses.length) {
                          return const Center(child: CircularProgressIndicator());
                        }

                        final business = businessProvider.businesses[index];
                        return BusinessCard(
                          business: business,
                          onTap: () {
                            Navigator.of(context).pushNamed(
                              '/business-detail',
                              arguments: business.id,
                            );
                          },
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),

      // Floating action button for SME users or prompt guest to login
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          if (user == null) {
            // Guest user - prompt to login
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Login Required'),
                content: const Text('Please login as an SME to add your business'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      Navigator.of(context).pushNamed('/login');
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
            );
          } else if (user.role == 'SME') {
            // SME user - navigate to create business
            Navigator.of(context).pushNamed('/create-business');
          } else {
            // Non-SME user
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Only SME users can add businesses'),
              ),
            );
          }
        },
        backgroundColor: AppTheme.primaryGreen,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Add Business',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}
