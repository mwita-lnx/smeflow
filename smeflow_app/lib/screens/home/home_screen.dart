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
                            Navigator.of(context).pushNamed('/profile');
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

                  // Search bar and Search button row
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
                      ElevatedButton(
                        onPressed: () {
                          _onSearch(_searchController.text);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryGreen,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: const Icon(Icons.search, size: 24),
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

                  final pagination = businessProvider.pagination;
                  final currentPage = pagination?['page'] ?? 1;
                  final totalPages = pagination?['totalPages'] ?? 1;

                  return Column(
                    children: [
                      Expanded(
                        child: RefreshIndicator(
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
                        ),
                      ),

                      // Pagination Controls
                      if (totalPages > 1)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 10,
                                offset: const Offset(0, -2),
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // Previous Button
                              IconButton(
                                onPressed: currentPage > 1
                                    ? () {
                                        businessProvider.searchBusinesses(
                                          query: _searchController.text.isNotEmpty
                                              ? _searchController.text
                                              : null,
                                          category: _selectedCategory,
                                          page: currentPage - 1,
                                        );
                                      }
                                    : null,
                                icon: const Icon(Icons.chevron_left),
                                style: IconButton.styleFrom(
                                  backgroundColor: currentPage > 1
                                      ? AppTheme.primaryGreen.withOpacity(0.1)
                                      : AppTheme.background,
                                  foregroundColor: currentPage > 1
                                      ? AppTheme.primaryGreen
                                      : AppTheme.textSecondary,
                                ),
                              ),

                              // Page Indicator
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Page $currentPage of $totalPages',
                                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                  const SizedBox(width: 12),
                                  // Quick page jump dropdown
                                  if (totalPages > 3)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: AppTheme.background,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: DropdownButton<int>(
                                        value: currentPage,
                                        underline: const SizedBox(),
                                        icon: const Icon(Icons.arrow_drop_down, size: 20),
                                        onChanged: (page) {
                                          if (page != null) {
                                            businessProvider.searchBusinesses(
                                              query: _searchController.text.isNotEmpty
                                                  ? _searchController.text
                                                  : null,
                                              category: _selectedCategory,
                                              page: page,
                                            );
                                          }
                                        },
                                        items: List.generate(
                                          totalPages,
                                          (index) => DropdownMenuItem(
                                            value: index + 1,
                                            child: Text('${index + 1}'),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),

                              // Next Button
                              IconButton(
                                onPressed: currentPage < totalPages
                                    ? () {
                                        businessProvider.searchBusinesses(
                                          query: _searchController.text.isNotEmpty
                                              ? _searchController.text
                                              : null,
                                          category: _selectedCategory,
                                          page: currentPage + 1,
                                        );
                                      }
                                    : null,
                                icon: const Icon(Icons.chevron_right),
                                style: IconButton.styleFrom(
                                  backgroundColor: currentPage < totalPages
                                      ? AppTheme.primaryGreen.withOpacity(0.1)
                                      : AppTheme.background,
                                  foregroundColor: currentPage < totalPages
                                      ? AppTheme.primaryGreen
                                      : AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
