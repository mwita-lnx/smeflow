import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../home/home_screen.dart';
import '../tenders/tenders_screen.dart';
import '../products/products_screen.dart';
import '../profile/profile_screen.dart';

class MainNavScreen extends StatefulWidget {
  const MainNavScreen({super.key});

  @override
  State<MainNavScreen> createState() => _MainNavScreenState();
}

class _MainNavScreenState extends State<MainNavScreen> with TickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  final List<Widget> _screens = const [
    HomeScreen(),
    TendersScreen(),
    ProductsScreen(),
    ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.9).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onItemTapped(int index) {
    if (_currentIndex != index) {
      _animationController.forward().then((_) {
        setState(() {
          _currentIndex = index;
        });
        _animationController.reverse();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      body: ScaleTransition(
        scale: _scaleAnimation,
        child: IndexedStack(
          index: _currentIndex,
          children: _screens,
        ),
      ),
      floatingActionButton: _buildFloatingActionButton(user),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget? _buildFloatingActionButton(user) {
    // Show FAB based on current screen
    if (_currentIndex == 0) {
      // Home screen - Add Business
      return FloatingActionButton(
        onPressed: () {
          if (user == null) {
            _showLoginDialog(context, 'Please login as an SME to add your business');
          } else if (user.role == 'SME') {
            Navigator.of(context).pushNamed('/create-business');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Only SME users can add businesses')),
            );
          }
        },
        backgroundColor: AppTheme.primaryGreen,
        elevation: 4,
        child: const Icon(Icons.add, color: Colors.white, size: 32),
      );
    } else if (_currentIndex == 1) {
      // Tenders screen - Post Tender
      return FloatingActionButton(
        onPressed: () {
          if (user == null) {
            _showLoginDialog(context, 'Please login to post a tender');
          } else {
            Navigator.of(context).pushNamed('/post-tender');
          }
        },
        backgroundColor: AppTheme.accentOrange,
        elevation: 4,
        child: const Icon(Icons.gavel, color: Colors.white, size: 28),
      );
    }
    return null;
  }

  Widget _buildBottomNavBar(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        child: BottomAppBar(
          height: 65,
          color: Colors.white,
          elevation: 0,
          notchMargin: 8,
          shape: const CircularNotchedRectangle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                icon: Icons.home_rounded,
                label: 'Home',
                index: 0,
                isActive: _currentIndex == 0,
              ),
              _buildNavItem(
                icon: Icons.description_rounded,
                label: 'Tenders',
                index: 1,
                isActive: _currentIndex == 1,
              ),
              const SizedBox(width: 48), // Space for FAB
              _buildNavItem(
                icon: Icons.shopping_bag_rounded,
                label: 'Products',
                index: 2,
                isActive: _currentIndex == 2,
              ),
              _buildNavItem(
                icon: Icons.person_rounded,
                label: 'Profile',
                index: 3,
                isActive: _currentIndex == 3,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
    required bool isActive,
  }) {
    final color = isActive ? AppTheme.primaryGreen : AppTheme.textSecondary;

    return Expanded(
      child: InkWell(
        onTap: () => _onItemTapped(index),
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          height: 60,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                  color: color,
                  height: 1.0,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showLoginDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Login Required'),
        content: Text(message),
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
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryGreen,
              foregroundColor: Colors.white,
            ),
            child: const Text('Login'),
          ),
        ],
      ),
    );
  }
}
